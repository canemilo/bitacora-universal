package bitacora.bitacorauniversal.web.template.dto;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public class RowResponse {
    private UUID id;
    private String displayName;
    private Map<String, Object> values;
    private Instant createdAt;
    private Instant updatedAt;

    public RowResponse(UUID id, String displayName, Map<String, Object> values, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.displayName = displayName;
        this.values = values;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() { return id; }
    public String getDisplayName() { return displayName; }
    public Map<String, Object> getValues() { return values; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}