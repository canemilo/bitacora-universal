package bitacora.bitacorauniversal.web.template.dto;

import java.util.UUID;

public class FieldResponse {
    private UUID id;
    private String fieldKey;
    private String label;
    private String dataType;
    private boolean required;
    private String optionsJson;
    private int orderIndex;

    public FieldResponse(UUID id, String fieldKey, String label, String dataType, boolean required, String optionsJson, int orderIndex) {
        this.id = id;
        this.fieldKey = fieldKey;
        this.label = label;
        this.dataType = dataType;
        this.required = required;
        this.optionsJson = optionsJson;
        this.orderIndex = orderIndex;
    }

    public UUID getId() { return id; }
    public String getFieldKey() { return fieldKey; }
    public String getLabel() { return label; }
    public String getDataType() { return dataType; }
    public boolean isRequired() { return required; }
    public String getOptionsJson() { return optionsJson; }
    public int getOrderIndex() { return orderIndex; }
}
