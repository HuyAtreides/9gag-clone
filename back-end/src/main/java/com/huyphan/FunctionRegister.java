package com.huyphan;

import org.hibernate.boot.MetadataBuilder;
import org.hibernate.boot.spi.MetadataBuilderContributor;
import org.hibernate.dialect.function.SQLFunctionTemplate;
import org.hibernate.type.StandardBasicTypes;

public class FunctionRegister implements MetadataBuilderContributor {

    @Override
    public void contribute(MetadataBuilder metadataBuilder) {
        metadataBuilder.applySqlFunction(
                "freetext",
                new SQLFunctionTemplate(StandardBasicTypes.BOOLEAN, "freetext(?1, ?2) AND 1")
        );
        metadataBuilder.applySqlFunction(
                "contains",
                new SQLFunctionTemplate(StandardBasicTypes.BOOLEAN, "contains(?1, ?2) AND 1")
        );
    }
}
