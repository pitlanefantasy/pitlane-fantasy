resource "google_container_cluster" "pitlane_cluster" {
  name     = "pitlane-cluster"
  location = var.zone

  initial_node_count = 1

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 20

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  deletion_protection = false
}

output "cluster_name" {
  description = "Nombre del cluster GKE"
  value       = google_container_cluster.pitlane_cluster.name
}

output "cluster_endpoint" {
  description = "IP del cluster GKE"
  value       = google_container_cluster.pitlane_cluster.endpoint
  sensitive   = true
}
