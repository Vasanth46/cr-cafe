package com.crcafe.core.service;

import com.crcafe.core.model.Bill;
import com.crcafe.core.model.FinancialSummary;
import com.crcafe.core.repository.BillRepository;
import com.crcafe.core.repository.FinancialSummaryRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArchivingService {

    private final BillRepository billRepository;
    private final FinancialSummaryRepository financialSummaryRepository;

    public ArchivingService(BillRepository billRepository, FinancialSummaryRepository financialSummaryRepository) {
        this.billRepository = billRepository;
        this.financialSummaryRepository = financialSummaryRepository;
    }

    /**
     * This method is scheduled to run automatically.
     * The cron expression "0 0 2 * * *" means it will run at 2:00 AM every day.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void archiveAndCleanupOldBills() {
        System.out.println("--- Starting nightly archiving and cleanup task ---");

        // Calculate the cutoff date (30 days ago)
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);

        // Find all bills older than the cutoff date
        List<Bill> billsToArchive = billRepository.findByBillDateBefore(cutoffDate);

        if (billsToArchive.isEmpty()) {
            System.out.println("No bills older than 30 days found to archive.");
            return;
        }

        System.out.println("Found " + billsToArchive.size() + " bills to archive and delete.");

        for (Bill bill : billsToArchive) {
            // 1. Create a financial summary record
            FinancialSummary summary = new FinancialSummary();
            summary.setArchivedDate(LocalDateTime.now());
            summary.setOriginalBillDate(bill.getBillDate());
            summary.setTotalAmount(bill.getTotalAmount());
            summary.setDiscount(bill.getDiscount());
            summary.setFinalAmount(bill.getFinalAmount());
            summary.setReceiptId(bill.getReceiptId());

            financialSummaryRepository.save(summary);

            // 2. Delete the old bill. The associated order and order items will also be
            //    deleted because of the cascade settings in our Order entity.
            billRepository.delete(bill);
        }

        System.out.println("--- Finished archiving and cleanup task. ---");
    }
}