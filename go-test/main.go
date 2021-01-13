package main

import (
	"fmt"
  "log"
  "net/http"
)

const port = "8080"

func main() {
	http.HandleFunc("/", handleHomePage)
	http.HandleFunc("/test", handleRequest)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleHomePage(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "Hello, the site is running :)")
}
