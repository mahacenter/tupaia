package main

import (
	"encoding/json"
	"fmt"
  "net/http"
)

func handleRequest(w http.ResponseWriter, r *http.Request) {
	analytics, err := FetchAnalytics()
	if err != nil {
		panic(err)
	}
	analyticsJson, err := json.Marshal(analytics)
	analyticsString := string(analyticsJson)
  fmt.Fprint(w, analyticsString)
}
