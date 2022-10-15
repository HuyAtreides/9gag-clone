package com.huyphan.repositories;

import com.huyphan.models.Section;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface SectionRepository extends CrudRepository<Section, Long> {

    @Override
    List<Section> findAll();
}
