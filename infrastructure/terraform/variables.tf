variable "project_id" {
    description = "Proyecto GCP"
    type        = string
    default     = "pitlane-fantasy"    
}

variable "region" {
    description = "Region GCP - región (Bélgica)"
    type        = string
    default     = "europe-west1"
}

variable "zone" {
    description = "Zona principal de GCP"
    type        = string
    default     = "europe-west1-b"
}

variable "db_password" {
    description = "pass"
    type        = string
    sensitive   = true
}
