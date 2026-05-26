resource "google_sql_database_instance" "pitlane_db" {
    name             = "pitlane-db"
    database_version = "POSTGRES_15"
    region           = var.region

    settings {
        tier = "db-f1-micro"

        backup_configuration {
            enabled = true
        }
    }
    
    deletion_protection = false
}

resource "google_sql_database" "pitlane" {
    name     = "pitlanedb"
    instance = google_sql_database_instance.pitlane_db.name
}
