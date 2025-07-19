// File: cr-cafe-billing-app/src/main/java/com/crcafe/app/CrCafeBillingApplication.java
package com.crcafe.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * The main entry point for the CR's Cafe Billing System application.
 */
@SpringBootApplication(scanBasePackages = "com.crcafe")
@EntityScan(basePackages = "com.crcafe.core.model")
@EnableJpaRepositories(basePackages = "com.crcafe.core.repository")
@EnableScheduling
public class CrCafeBillingApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrCafeBillingApplication.class, args);
    }

}
