CREATE TABLE template (
                          id            BINARY(16) NOT NULL,
                          owner_id      VARCHAR(64) NOT NULL,
                          name          VARCHAR(120) NOT NULL,
                          description   VARCHAR(500) NULL,
                          created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                          updated_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                          PRIMARY KEY (id),
                          UNIQUE KEY uk_template_owner_name (owner_id, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE template_field (
                                id            BINARY(16) NOT NULL,
                                template_id   BINARY(16) NOT NULL,
                                field_key     VARCHAR(60) NOT NULL,
                                label         VARCHAR(120) NOT NULL,
                                data_type     VARCHAR(20) NOT NULL,
                                required      BOOLEAN NOT NULL DEFAULT FALSE,
                                options_json  JSON NULL,
                                order_index   INT NOT NULL DEFAULT 0,
                                created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                                updated_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                                PRIMARY KEY (id),
                                CONSTRAINT fk_field_template
                                    FOREIGN KEY (template_id) REFERENCES template(id)
                                        ON DELETE CASCADE,
                                UNIQUE KEY uk_field_template_key (template_id, field_key),
                                KEY ix_field_template_order (template_id, order_index),
                                CONSTRAINT ck_field_datatype
                                    CHECK (data_type IN ('TEXT','NUMBER','BOOLEAN','DATE','SELECT'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE object_row (
                            id            BINARY(16) NOT NULL,
                            owner_id      VARCHAR(64) NOT NULL,
                            template_id   BINARY(16) NOT NULL,
                            display_name  VARCHAR(160) NOT NULL,
                            values_json   JSON NOT NULL,
                            created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                            updated_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                            PRIMARY KEY (id),
                            CONSTRAINT fk_row_template
                                FOREIGN KEY (template_id) REFERENCES template(id)
                                    ON DELETE CASCADE,
                            KEY ix_row_owner_template_created (owner_id, template_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE log_entry (
                           id            BINARY(16) NOT NULL,
                           owner_id      VARCHAR(64) NOT NULL,
                           row_id        BINARY(16) NOT NULL,
                           score         DECIMAL(4,2) NOT NULL,
                           comment       TEXT NOT NULL,
                           event_date    DATE NULL,
                           created_at    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                           PRIMARY KEY (id),
                           CONSTRAINT fk_log_row
                               FOREIGN KEY (row_id) REFERENCES object_row(id)
                                   ON DELETE CASCADE,
                           KEY ix_log_owner_row_created (owner_id, row_id, created_at),
                           CONSTRAINT ck_log_score_range
                               CHECK (score >= 0.00 AND score <= 10.00)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;