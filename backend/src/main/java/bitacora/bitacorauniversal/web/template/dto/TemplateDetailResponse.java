package bitacora.bitacorauniversal.web.template.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class TemplateDetailResponse {

    private UUID id;
    private String name;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
    private List<FieldResponse> fields;

    public TemplateDetailResponse(UUID id, String name, String description,
                                  Instant createdAt, Instant updatedAt,
                                  List<FieldResponse> fields) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.fields = fields;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<FieldResponse> getFields() { return fields; }
}
