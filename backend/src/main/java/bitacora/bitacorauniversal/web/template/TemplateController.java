package bitacora.bitacorauniversal.web.template;

import bitacora.bitacorauniversal.application.template.TemplateService;
import bitacora.bitacorauniversal.web.template.dto.CreateTemplateRequest;
import bitacora.bitacorauniversal.web.template.dto.TemplateDetailResponse;
import bitacora.bitacorauniversal.web.template.dto.TemplateResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/templates")
public class TemplateController {

    private final TemplateService service;

    public TemplateController(TemplateService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TemplateResponse create(@Valid @RequestBody CreateTemplateRequest req) {
        return service.create(req);
    }

    @GetMapping("/{templateId}")
    public TemplateDetailResponse getOne(@PathVariable UUID templateId) {
        return service.getOneWithFields(templateId);
    }

    @GetMapping
    public List<TemplateResponse> list() {
        return service.list();
    }
}