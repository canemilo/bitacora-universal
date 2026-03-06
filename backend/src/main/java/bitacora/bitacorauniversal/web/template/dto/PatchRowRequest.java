package bitacora.bitacorauniversal.web.template.dto;

import jakarta.validation.constraints.Size;

import java.util.Map;

public class PatchRowRequest {

    @Size(max = 160)
    private String displayName;

    // parcial: solo campos a modificar
    private Map<String, Object> values;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public Map<String, Object> getValues() { return values; }
    public void setValues(Map<String, Object> values) { this.values = values; }
}
