import { respond } from '@tupaia/utils';
import { AccessRequest, Entity, Project } from '/models';
import { calculateBoundsFromEntities } from '/utils/geoJson';

async function fetchEntitiesWithProjectAccess(req, entities, userGroups) {
  return Promise.all(
    entities.map(async ({ id, name, code, bounds }) => ({
      id,
      name,
      code,
      bounds,
      hasAccess: await Promise.all(userGroups.map(u => req.userHasAccess(code, u))),
    })),
  );
}

const fetchHasPendingProjectAccess = async (projectId, userId) => {
  if (!projectId || !userId) return false;

  const accessRequests = await AccessRequest.find({
    user_id: userId,
    project_id: projectId,
    processed_date: null,
  });
  return accessRequests.length > 0;
};

async function buildProjectDataForFrontend(project, req) {
  const {
    id: projectId,
    name,
    code,
    description,
    sort_order: sortOrder,
    image_url: imageUrl,
    logo_url: logoUrl,
    user_groups: userGroups,
    entity_ids: entityIds,
    dashboard_group_name: dashboardGroupName,
    default_measure: defaultMeasure,
  } = project;

  const entities = await Promise.all(entityIds.map(id => Entity.findById(id)));
  const accessByEntity = await fetchEntitiesWithProjectAccess(req, entities, userGroups);
  const entitiesWithAccess = accessByEntity.filter(e => e.hasAccess.some(x => x));
  const names = entities.map(e => e.name);

  // This controls which entity the project zooms to and what level dashboards are shown on the front-end.
  // If a single entity is available, zoom to that, otherwise show the project entity
  const hasAccess = entitiesWithAccess.length > 0;
  const homeEntityCode = entitiesWithAccess.length === 1 ? entitiesWithAccess[0].code : code;

  // Only want to check pending if no access
  const { userId } = req.session.userJson;
  const hasPendingAccess = hasAccess
    ? false
    : await fetchHasPendingProjectAccess(projectId, userId);

  return {
    name,
    code,
    userGroups,
    description,
    sortOrder,
    imageUrl,
    logoUrl,
    names,
    bounds: calculateBoundsFromEntities(entitiesWithAccess),
    hasAccess,
    hasPendingAccess,
    homeEntityCode,
    dashboardGroupName,
    defaultMeasure,
  };
}

export async function getProjects(req, res) {
  const data = await Project.getProjectDetails();
  const promises = data.map(project => buildProjectDataForFrontend(project, req));
  const projects = await Promise.all(promises);

  return respond(res, { projects });
}
