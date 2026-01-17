[1mdiff --git a/src/app/agents/sponsorship-transfer/page.tsx b/src/app/agents/sponsorship-transfer/page.tsx[m
[1mindex 62010ec..2ee8627 100644[m
[1m--- a/src/app/agents/sponsorship-transfer/page.tsx[m
[1m+++ b/src/app/agents/sponsorship-transfer/page.tsx[m
[36m@@ -386,10 +386,8 @@[m [mexport default function SponsorshipTransferPage() {[m
                       <Col xs={24} sm={8} md={4}>[m
                         <div className={styles.contractNumber}>[m
                           <div className={styles.numberBadge}>[m
[31m-                            <span className={styles.sequenceNumber}>{contract.id}</span>[m
[31m-                            <h2 className={styles.mainNumber}>[m
[31m-                              {contract.contractNumber.split('-')[1]}[m
[31m-                            </h2>[m
[32m+[m[32m                            <span className={styles.sequenceNumber}>{contract.contractNumber}</span>[m
[32m+[m[32m                            <h2 className={styles.mainNumber}>{contract.id}</h2>[m
                             <span className={styles.dateText}>{contract.creationDate}</span>[m
                           </div>[m
                         </div>[m
