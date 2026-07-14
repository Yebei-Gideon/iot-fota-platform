-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'UPLOAD', 'DOWNLOAD', 'DEPLOY', 'ROLLBACK', 'URL_ISSUED', 'VERIFY');

-- CreateEnum
CREATE TYPE "UrlType" AS ENUM ('UPLOAD', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'UPDATING', 'FAILED', 'RETIRED');

-- CreateEnum
CREATE TYPE "OTAEventType" AS ENUM ('CAMPAIGN_CREATED', 'CAMPAIGN_STARTED', 'CAMPAIGN_PAUSED', 'CAMPAIGN_RESUMED', 'CAMPAIGN_COMPLETED', 'CAMPAIGN_CANCELLED', 'CAMPAIGN_REACTIVATED', 'TARGET_ADDED', 'TARGET_UPDATED', 'ERROR_OCCURRED');

-- CreateEnum
CREATE TYPE "RolloutStrategy" AS ENUM ('IMMEDIATE', 'GRADUAL', 'CANARY', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "TargetStatus" AS ENUM ('PENDING', 'DOWNLOADING', 'VERIFYING', 'INSTALLING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TelemetryType" AS ENUM ('HEARTBEAT', 'SYSTEM_HEALTH', 'NETWORK_STATUS', 'BATTERY_STATUS', 'UPDATE_PROGRESS', 'ERROR_REPORT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "UpdatePhase" AS ENUM ('IDLE', 'CHECKING', 'DOWNLOADING', 'DOWNLOADED', 'VERIFYING', 'INSTALLING', 'REBOOTING', 'COMPLETED', 'FAILED', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'DEVICE');

-- CreateEnum
CREATE TYPE "SignatureAlgorithm" AS ENUM ('ED25519', 'RSA_SHA256', 'ECDSA_P256');

-- CreateEnum
CREATE TYPE "FirmwareStatus" AS ENUM ('DRAFT', 'TESTING', 'APPROVED', 'DEPRECATED', 'REVOKED');

-- CreateEnum
CREATE TYPE "FileSystemType" AS ENUM ('LITTLEFS', 'SPIFFS', 'FATFS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "FileSystemStatus" AS ENUM ('DRAFT', 'APPROVED', 'DEPRECATED');

-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "alert_events" (
    "id" TEXT NOT NULL,
    "alert_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" "AlertSeverity" NOT NULL,
    "condition" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "changes" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hardware_model" TEXT NOT NULL,
    "manufacturer" TEXT,
    "mac_address" TEXT,
    "hardware_serial" TEXT,
    "current_version" TEXT,
    "target_version" TEXT,
    "security_version" INTEGER NOT NULL DEFAULT 1,
    "secure_element_present" BOOLEAN NOT NULL DEFAULT false,
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "last_seen_at" TIMESTAMP(3),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "auth_type" TEXT NOT NULL DEFAULT 'API_KEY',
    "device_secret_hash" TEXT,
    "cert_serial" TEXT,
    "cert_fingerprint" TEXT,
    "ota_check_interval_days" INTEGER,
    "ota_check_interval_secs" INTEGER,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firmwares" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "security_version" INTEGER NOT NULL DEFAULT 1,
    "hardware_model" TEXT NOT NULL,
    "status" "FirmwareStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "changelog" TEXT,
    "file_path" TEXT NOT NULL DEFAULT '',
    "file_name" TEXT,
    "file_size" BIGINT,
    "checksum" TEXT,
    "algorithm" TEXT NOT NULL DEFAULT 'sha256',
    "is_stable" BOOLEAN NOT NULL DEFAULT false,
    "is_encrypted" BOOLEAN NOT NULL DEFAULT false,
    "encryption_algorithm" TEXT,
    "target_device_platform" TEXT,
    "esp_header_metadata" JSONB,
    "preferred_signature_algorithm" TEXT NOT NULL DEFAULT 'ED25519',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "firmwares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firmware_deltas" (
    "id" TEXT NOT NULL,
    "from_firmware_id" TEXT NOT NULL,
    "to_firmware_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "checksum" TEXT NOT NULL,
    "algorithm" TEXT NOT NULL DEFAULT 'sha256',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "firmware_deltas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filesystem_images" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "security_version" INTEGER NOT NULL DEFAULT 1,
    "hardware_model" TEXT NOT NULL,
    "fs_type" "FileSystemType" NOT NULL DEFAULT 'LITTLEFS',
    "description" TEXT,
    "status" "FileSystemStatus" NOT NULL DEFAULT 'DRAFT',
    "file_path" TEXT NOT NULL DEFAULT '',
    "file_name" TEXT,
    "file_size" BIGINT,
    "checksum" TEXT,
    "algorithm" TEXT NOT NULL DEFAULT 'sha256',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "changelog" TEXT,
    "is_stable" BOOLEAN NOT NULL DEFAULT false,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "filesystem_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manifests" (
    "id" TEXT NOT NULL,
    "firmware_id" TEXT NOT NULL,
    "manifest_version" INTEGER NOT NULL DEFAULT 1,
    "sha256_checksum" TEXT NOT NULL,
    "content_type" TEXT NOT NULL DEFAULT 'application/octet-stream',
    "signature" TEXT,
    "signature_algorithm" TEXT NOT NULL DEFAULT 'ED25519',
    "public_key_id" TEXT,
    "min_firmware_version" TEXT,
    "max_firmware_version" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manifests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ota_campaigns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "firmware_id" TEXT NOT NULL,
    "group_id" TEXT,
    "rollback_policy_id" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "strategy" "RolloutStrategy" NOT NULL DEFAULT 'IMMEDIATE',
    "rollout_percentage" DOUBLE PRECISION,
    "min_version" TEXT,
    "max_version" TEXT,
    "scheduled_for" TIMESTAMP(3),
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "success_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_targets" INTEGER NOT NULL DEFAULT 0,
    "success_targets" INTEGER NOT NULL DEFAULT 0,
    "failed_targets" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ota_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ota_events" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "event_type" "OTAEventType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ota_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ota_targets" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "from_version" TEXT,
    "status" "TargetStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_for" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ota_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rollback_policies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "max_failure_rate" DOUBLE PRECISION NOT NULL,
    "min_update_count" INTEGER NOT NULL,
    "auto_rollback" BOOLEAN NOT NULL DEFAULT true,
    "notify_on_rollback" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "rollback_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telemetry_events" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "event_type" "TelemetryType" NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "telemetry_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "update_states" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "from_version" TEXT,
    "to_version" TEXT NOT NULL,
    "state" "UpdatePhase" NOT NULL DEFAULT 'IDLE',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "downloaded_bytes" BIGINT NOT NULL DEFAULT 0,
    "total_bytes" BIGINT,
    "error_message" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "update_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'OPERATOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_name" TEXT,
    "avatar_url" TEXT,
    "provider_email" TEXT,
    "provider" TEXT,
    "password" TEXT NOT NULL,
    "email_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "email_confirmed_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_api_keys" (
    "id" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "device_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "scopes" TEXT[] DEFAULT ARRAY['device:read', 'device:write', 'firmware:read']::TEXT[],
    "expires_at" TIMESTAMP(3),
    "last_used_at" TIMESTAMP(3),
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "cover_image" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "tags" TEXT[],
    "author_id" TEXT NOT NULL,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documentation_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentation_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "signed_url_logs" (
    "id" TEXT NOT NULL,
    "firmware_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url_type" "UrlType" NOT NULL,
    "file_path" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signed_url_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_replies" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DeviceToGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DeviceToGroup_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "alert_events_alert_id_idx" ON "alert_events"("alert_id");

-- CreateIndex
CREATE INDEX "alert_events_created_at_idx" ON "alert_events"("created_at");

-- CreateIndex
CREATE INDEX "alert_events_resolved_idx" ON "alert_events"("resolved");

-- CreateIndex
CREATE INDEX "alerts_enabled_idx" ON "alerts"("enabled");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "alerts_user_id_idx" ON "alerts"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_resource_idx" ON "audit_logs"("resource");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "device_groups_user_id_idx" ON "device_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_groups_user_id_name_key" ON "device_groups"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "devices_mac_address_key" ON "devices"("mac_address");

-- CreateIndex
CREATE UNIQUE INDEX "devices_hardware_serial_key" ON "devices"("hardware_serial");

-- CreateIndex
CREATE UNIQUE INDEX "devices_cert_serial_key" ON "devices"("cert_serial");

-- CreateIndex
CREATE UNIQUE INDEX "devices_cert_fingerprint_key" ON "devices"("cert_fingerprint");

-- CreateIndex
CREATE INDEX "devices_device_id_idx" ON "devices"("device_id");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "devices_user_id_idx" ON "devices"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_user_id_device_id_key" ON "devices"("user_id", "device_id");

-- CreateIndex
CREATE INDEX "firmwares_user_id_idx" ON "firmwares"("user_id");

-- CreateIndex
CREATE INDEX "firmwares_version_idx" ON "firmwares"("version");

-- CreateIndex
CREATE INDEX "firmwares_hardware_model_idx" ON "firmwares"("hardware_model");

-- CreateIndex
CREATE INDEX "firmwares_status_idx" ON "firmwares"("status");

-- CreateIndex
CREATE UNIQUE INDEX "firmwares_user_id_version_hardware_model_key" ON "firmwares"("user_id", "version", "hardware_model");

-- CreateIndex
CREATE INDEX "firmware_deltas_from_firmware_id_idx" ON "firmware_deltas"("from_firmware_id");

-- CreateIndex
CREATE INDEX "firmware_deltas_to_firmware_id_idx" ON "firmware_deltas"("to_firmware_id");

-- CreateIndex
CREATE UNIQUE INDEX "firmware_deltas_from_firmware_id_to_firmware_id_key" ON "firmware_deltas"("from_firmware_id", "to_firmware_id");

-- CreateIndex
CREATE INDEX "filesystem_images_user_id_idx" ON "filesystem_images"("user_id");

-- CreateIndex
CREATE INDEX "filesystem_images_hardware_model_idx" ON "filesystem_images"("hardware_model");

-- CreateIndex
CREATE INDEX "filesystem_images_status_idx" ON "filesystem_images"("status");

-- CreateIndex
CREATE UNIQUE INDEX "filesystem_images_user_id_version_hardware_model_fs_type_key" ON "filesystem_images"("user_id", "version", "hardware_model", "fs_type");

-- CreateIndex
CREATE INDEX "manifests_firmware_id_idx" ON "manifests"("firmware_id");

-- CreateIndex
CREATE INDEX "manifests_is_active_idx" ON "manifests"("is_active");

-- CreateIndex
CREATE INDEX "ota_campaigns_firmware_id_idx" ON "ota_campaigns"("firmware_id");

-- CreateIndex
CREATE INDEX "ota_campaigns_status_idx" ON "ota_campaigns"("status");

-- CreateIndex
CREATE INDEX "ota_campaigns_user_id_idx" ON "ota_campaigns"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ota_campaigns_user_id_name_key" ON "ota_campaigns"("user_id", "name");

-- CreateIndex
CREATE INDEX "ota_events_campaign_id_idx" ON "ota_events"("campaign_id");

-- CreateIndex
CREATE INDEX "ota_events_event_type_idx" ON "ota_events"("event_type");

-- CreateIndex
CREATE INDEX "ota_targets_campaign_id_idx" ON "ota_targets"("campaign_id");

-- CreateIndex
CREATE INDEX "ota_targets_device_id_idx" ON "ota_targets"("device_id");

-- CreateIndex
CREATE INDEX "ota_targets_status_idx" ON "ota_targets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ota_targets_campaign_id_device_id_key" ON "ota_targets"("campaign_id", "device_id");

-- CreateIndex
CREATE INDEX "rollback_policies_enabled_idx" ON "rollback_policies"("enabled");

-- CreateIndex
CREATE INDEX "telemetry_events_created_at_idx" ON "telemetry_events"("created_at");

-- CreateIndex
CREATE INDEX "telemetry_events_device_id_idx" ON "telemetry_events"("device_id");

-- CreateIndex
CREATE INDEX "telemetry_events_event_type_idx" ON "telemetry_events"("event_type");

-- CreateIndex
CREATE INDEX "update_states_device_id_idx" ON "update_states"("device_id");

-- CreateIndex
CREATE INDEX "update_states_state_idx" ON "update_states"("state");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_provider_email_key" ON "users"("provider_email");

-- CreateIndex
CREATE UNIQUE INDEX "device_api_keys_key_hash_key" ON "device_api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "device_api_keys_device_id_idx" ON "device_api_keys"("device_id");

-- CreateIndex
CREATE INDEX "device_api_keys_key_hash_idx" ON "device_api_keys"("key_hash");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_key" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "api_keys_user_id_idx" ON "api_keys"("user_id");

-- CreateIndex
CREATE INDEX "api_keys_key_hash_idx" ON "api_keys"("key_hash");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_slug_idx" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_published_idx" ON "blog_posts"("published");

-- CreateIndex
CREATE INDEX "blog_posts_author_id_idx" ON "blog_posts"("author_id");

-- CreateIndex
CREATE INDEX "blog_posts_category_idx" ON "blog_posts"("category");

-- CreateIndex
CREATE UNIQUE INDEX "documentation_pages_slug_key" ON "documentation_pages"("slug");

-- CreateIndex
CREATE INDEX "documentation_pages_slug_idx" ON "documentation_pages"("slug");

-- CreateIndex
CREATE INDEX "documentation_pages_category_idx" ON "documentation_pages"("category");

-- CreateIndex
CREATE INDEX "documentation_pages_published_idx" ON "documentation_pages"("published");

-- CreateIndex
CREATE INDEX "documentation_pages_author_id_idx" ON "documentation_pages"("author_id");

-- CreateIndex
CREATE INDEX "contact_messages_status_idx" ON "contact_messages"("status");

-- CreateIndex
CREATE INDEX "contact_messages_email_idx" ON "contact_messages"("email");

-- CreateIndex
CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages"("created_at");

-- CreateIndex
CREATE INDEX "signed_url_logs_firmware_id_idx" ON "signed_url_logs"("firmware_id");

-- CreateIndex
CREATE INDEX "signed_url_logs_user_id_idx" ON "signed_url_logs"("user_id");

-- CreateIndex
CREATE INDEX "signed_url_logs_created_at_idx" ON "signed_url_logs"("created_at");

-- CreateIndex
CREATE INDEX "signed_url_logs_url_type_idx" ON "signed_url_logs"("url_type");

-- CreateIndex
CREATE INDEX "contact_replies_message_id_idx" ON "contact_replies"("message_id");

-- CreateIndex
CREATE INDEX "contact_replies_author_id_idx" ON "contact_replies"("author_id");

-- CreateIndex
CREATE INDEX "_DeviceToGroup_B_index" ON "_DeviceToGroup"("B");

-- AddForeignKey
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_groups" ADD CONSTRAINT "device_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firmwares" ADD CONSTRAINT "firmwares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firmware_deltas" ADD CONSTRAINT "firmware_deltas_from_firmware_id_fkey" FOREIGN KEY ("from_firmware_id") REFERENCES "firmwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firmware_deltas" ADD CONSTRAINT "firmware_deltas_to_firmware_id_fkey" FOREIGN KEY ("to_firmware_id") REFERENCES "firmwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filesystem_images" ADD CONSTRAINT "filesystem_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_firmware_id_fkey" FOREIGN KEY ("firmware_id") REFERENCES "firmwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_campaigns" ADD CONSTRAINT "ota_campaigns_firmware_id_fkey" FOREIGN KEY ("firmware_id") REFERENCES "firmwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_campaigns" ADD CONSTRAINT "ota_campaigns_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "device_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_campaigns" ADD CONSTRAINT "ota_campaigns_rollback_policy_id_fkey" FOREIGN KEY ("rollback_policy_id") REFERENCES "rollback_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_campaigns" ADD CONSTRAINT "ota_campaigns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_events" ADD CONSTRAINT "ota_events_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "ota_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_targets" ADD CONSTRAINT "ota_targets_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "ota_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ota_targets" ADD CONSTRAINT "ota_targets_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rollback_policies" ADD CONSTRAINT "rollback_policies_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "telemetry_events" ADD CONSTRAINT "telemetry_events_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "update_states" ADD CONSTRAINT "update_states_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_api_keys" ADD CONSTRAINT "device_api_keys_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentation_pages" ADD CONSTRAINT "documentation_pages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signed_url_logs" ADD CONSTRAINT "signed_url_logs_firmware_id_fkey" FOREIGN KEY ("firmware_id") REFERENCES "firmwares"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "signed_url_logs" ADD CONSTRAINT "signed_url_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_replies" ADD CONSTRAINT "contact_replies_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "contact_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_replies" ADD CONSTRAINT "contact_replies_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToGroup" ADD CONSTRAINT "_DeviceToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "device_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToGroup" ADD CONSTRAINT "_DeviceToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
