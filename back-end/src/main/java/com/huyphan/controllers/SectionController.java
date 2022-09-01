package com.huyphan.controllers;

import com.huyphan.dtos.SectionDto;
import com.huyphan.mappers.SectionMapper;
import com.huyphan.models.Section;
import com.huyphan.services.SectionService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("section")
public class SectionController {

    @Autowired
    private SectionMapper sectionMapper;

    @Autowired
    private SectionService sectionService;

    @GetMapping
    public List<SectionDto> getSections() {
        List<Section> sections = sectionService.getAllSections();

        return sections.stream().map(sectionMapper::toDto).collect(Collectors.toList());
    }
}
