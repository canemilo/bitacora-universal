package bitacora.bitacorauniversal.web.template.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateFieldRequest {

    @NotBlank
    @Size(max = 60)
    private String fieldKey;

    @NotBlank
    @Size(max = 120)
    private String label;

    @NotBlank
    private String dataType; // TEXT, NUMBER, BOOLEAN, DATE, SELECT

    private boolean required;

    // Solo para SELECT: JSON array, ej: ["Gasolina","Diesel"]
    @Size(max = 2000)
    private String optionsJson;

    private int orderIndex;

    public String getFieldKey() { return fieldKey; }
    public void setFieldKey(String fieldKey) { this.fieldKey = fieldKey; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }

    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }

    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }

    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
