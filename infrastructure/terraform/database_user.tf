resource "google_sql_user" "pitlane_user" {
    name     = "pitlane"
    instance = google_sql_database_instance.pitlane_db.name
    password = var.db_password
}