package bitacora.bitacorauniversal.web.template;

import bitacora.bitacorauniversal.application.template.FieldService;
import bitacora.bitacorauniversal.web.template.dto.CreateFieldRequest;
import bitacora.bitacorauniversal.web.template.dto.FieldResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates/{templateId}/fields")
public class FieldController {

    private final FieldService service;

    public FieldController(FieldService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FieldResponse create(@PathVariable UUID templateId, @Valid @RequestBody CreateFieldRequest req) {
        return service.create(templateId, req);
    }

    @GetMapping
    public List<FieldResponse> list(@PathVariable UUID templateId) {
        return service.list(templateId);
    }
}
