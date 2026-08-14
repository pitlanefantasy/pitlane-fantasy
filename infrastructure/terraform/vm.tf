resource "google_compute_instance" "pitlane_vm" {
  name         = "pitlane-vm"
  machine_type = "e2-small"
  zone         = var.zone
  tags         = ["pitlane-web"]

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-12"
      size  = 20
      type  = "pd-standard"
    }
  }

  network_interface {
    network = "default"
    access_config {
      # Bloque vacío = IP externa asignada automáticamente
    }
  }
}

resource "google_compute_firewall" "pitlane_vm_web" {
  name    = "pitlane-vm-allow-web"
  network = "default"

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["pitlane-web"]
}

output "pitlane_vm_ip" {
  description = "IP externa de la VM nueva"
  value       = google_compute_instance.pitlane_vm.network_interface[0].access_config[0].nat_ip
}
