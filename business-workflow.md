# Sigma Recruitment - Business Workflow & User Story Map

```mermaid
graph TD
    %% ===== ENTRY POINT =====
    START([User Opens Application]) --> AUTH_CHECK{Is User Authenticated?}
    AUTH_CHECK -- No --> LOGIN[Login Page<br/>Enter Username & Password]
    AUTH_CHECK -- Yes --> DASH

    LOGIN --> LOGIN_VALID{Credentials Valid?}
    LOGIN_VALID -- No --> LOGIN
    LOGIN_VALID -- Yes --> DASH[Dashboard<br/>View KPIs: Total Customers, Contracts,<br/>Success Rate, Active Contracts]

    %% ===== DASHBOARD HUB =====
    DASH --> NAV_CHOICE{User Navigates To...}

    %% ===== BRANCH MANAGEMENT =====
    NAV_CHOICE --> BRANCH[Branch Management<br/>View All Branch Offices]
    BRANCH --> BRANCH_ACT{Branch Action?}
    BRANCH_ACT --> BRANCH_ADD[Create New Branch<br/>License, Tax, Address Details]
    BRANCH_ACT --> BRANCH_EDIT[Edit Branch Information]
    BRANCH_ACT --> BRANCH_DOCS[Branch Documents<br/>Upload & Track Expiry Dates]
    BRANCH_ADD --> BRANCH_DONE(Branch Registered Successfully)
    BRANCH_EDIT --> BRANCH_DONE
    BRANCH_DOCS --> DOC_STATUS{Document Status?}
    DOC_STATUS --> DOC_VALID(Document Valid)
    DOC_STATUS --> DOC_EXPIRING(Document Expiring Soon - Alert)
    DOC_STATUS --> DOC_EXPIRED(Document Expired - Action Required)

    %% ===== CUSTOMER MANAGEMENT =====
    NAV_CHOICE --> CUST[Customers<br/>View All Customers]
    CUST --> CUST_ACT{Customer Action?}
    CUST_ACT --> CUST_ADD[Register New Customer<br/>Name, ID, Nationality, Income, Housing]
    CUST_ACT --> CUST_EDIT[Edit Customer Details]
    CUST_ACT --> CUST_CONTRACT[Create Contract for Customer]
    CUST_ACT --> CUST_CONTACTS[View Contact History<br/>Phone, Email, WhatsApp, Visit, SMS]
    CUST_ACT --> CUST_PHONES[Manage Customer Phone Numbers]
    CUST_ADD --> CUST_DONE(Customer Registered Successfully)
    CUST_EDIT --> CUST_DONE
    CUST_CONTRACT --> CONTRACT_TYPE_CHOICE{Which Contract Type?}
    CUST_CONTACTS --> CONTACT_STATUS{Contact Status?}
    CONTACT_STATUS --> CONTACT_DONE(Contact Completed)
    CONTACT_STATUS --> CONTACT_FOLLOWUP(Requires Follow-up)

    %% ===== WORKER / APPLICANT MANAGEMENT =====
    NAV_CHOICE --> WORKERS[Workers<br/>View All Workers]
    WORKERS --> WORKER_TAB{Worker Category?}
    WORKER_TAB --> W_ALL[All Workers List<br/>Filter by Nationality, Job, Agent, Gender]
    WORKER_TAB --> W_AVAIL[Available Workers<br/>Ready for Assignment]
    WORKER_TAB --> W_FOLLOWUP[Worker Follow-up<br/>Medical Status & Updates]

    W_ALL --> W_ACT{Worker Action?}
    W_ACT --> W_ADD[Register New Worker<br/>Passport, Nationality, Job, Skills, Religion]
    W_ACT --> W_EDIT[Edit Worker Profile]
    W_ACT --> W_MEDICAL[Record Medical Examination]
    W_ACT --> W_STATUS_CHANGE{Change Worker Status}
    W_STATUS_CHANGE --> W_ESCAPED(Marked as Escaped)
    W_STATUS_CHANGE --> W_REFUSED(Marked as Refused)
    W_STATUS_CHANGE --> W_SICK(Marked as Sick)
    W_STATUS_CHANGE --> W_DEACTIVATED(Deactivated)
    W_ADD --> W_REGISTERED(Worker Registered Successfully)
    W_EDIT --> W_REGISTERED

    W_MEDICAL --> MED_RESULT{Medical Exam Result?}
    MED_RESULT --> MED_PASS(Medical Exam Passed)
    MED_RESULT --> MED_FAIL(Medical Exam Failed)

    W_AVAIL --> W_AVAIL_FILTER{Filter by Contract Type}
    W_AVAIL_FILTER --> W_AVAIL_MED[Mediation Workers]
    W_AVAIL_FILTER --> W_AVAIL_RENT[Rent/Operation Workers]
    W_AVAIL_FILTER --> W_AVAIL_TRANSFER[Sponsorship Transfer Workers]

    %% ===== CONTRACTS - MEDIATION =====
    NAV_CHOICE --> MED_CONTRACTS[Mediation Contracts<br/>View All Mediation Contracts]
    CONTRACT_TYPE_CHOICE --> MED_CONTRACTS
    MED_CONTRACTS --> MED_ACT{Mediation Action?}
    MED_ACT --> MED_CREATE[Create Mediation Contract<br/>Select Offer by Nationality & Job]
    MED_ACT --> MED_VIEW[View Contract Details<br/>Notes, Invoices, Follow-up Timeline]
    MED_ACT --> MED_CANCEL_ACT[Cancel Contract<br/>Provide Cancellation Reason]
    MED_ACT --> MED_TYPE_CHANGE[Change Contract Type]
    MED_ACT --> MED_ADD_INSURANCE[Add Insurance/Premium Offer]
    MED_ACT --> MED_INVOICE[Generate Invoice]
    MED_ACT --> MED_NOTES[Add Notes to Contract]

    MED_CREATE --> MED_OFFER_SELECT[Select Mediation Offer<br/>Nationality, Job, Salary, Insurance]
    MED_OFFER_SELECT --> MED_CREATED(Mediation Contract Created)

    MED_CREATED --> AUTO_FOLLOWUP[Automatic Follow-up Workflow<br/>Track Contract Progress]
    AUTO_FOLLOWUP --> FU_MEDICAL[Step 1: Medical Examination]
    FU_MEDICAL --> FU_MUSAND[Step 2: MUSAND Registration]
    FU_MUSAND --> FU_POLO[Step 3: POLO Clearance]
    FU_POLO --> FU_TESDA[Step 4: TESDA Certification]
    FU_TESDA --> FU_OWWA[Step 5: OWWA Insurance]
    FU_OWWA --> FU_BIOMETRIC[Step 6: Biometric Processing]
    FU_BIOMETRIC --> FU_VISA[Step 7: Visa Stamping]
    FU_VISA --> FU_TRAVEL[Step 8: Travel Clearance]
    FU_TRAVEL --> FU_FLIGHT[Step 9: Flight Booking]
    FU_FLIGHT --> FU_ARRIVAL[Step 10: Worker Arrival]
    FU_ARRIVAL --> WARRANTY_START(Warranty Period Begins - 90/120 Days)

    %% ===== MEDIATION OFFERS MANAGEMENT =====
    MED_ACT --> MED_OFFERS[Manage Mediation Offers<br/>Set Pricing by Nationality & Job]
    MED_OFFERS --> MED_OFFER_ACT{Offer Action?}
    MED_OFFER_ACT --> MED_OFFER_ADD[Create New Mediation Offer<br/>Nationality, Job, Salary, Local/Agent Cost]
    MED_OFFER_ACT --> MED_OFFER_EDIT[Edit Offer Pricing]
    MED_OFFER_ADD --> MED_OFFER_SAVED(Mediation Offer Saved)
    MED_OFFER_EDIT --> MED_OFFER_SAVED

    %% ===== CONTRACTS - OPERATION / RENT =====
    NAV_CHOICE --> RENT_CONTRACTS[Operation Contracts<br/>View All Rent Contracts]
    CONTRACT_TYPE_CHOICE --> RENT_CONTRACTS
    RENT_CONTRACTS --> RENT_ACT{Operation Action?}
    RENT_ACT --> RENT_CREATE[Create Rent Contract<br/>Select Worker & Offer]
    RENT_ACT --> RENT_VIEW[View Contract Details<br/>Monthly Rent, Collections, Remaining]
    RENT_ACT --> RENT_COLLECT[Record Payment Collection]
    RENT_ACT --> RENT_RENEW[Renew Contract]

    RENT_CREATE --> RENT_CREATED(Rent Contract Created)
    RENT_COLLECT --> RENT_PAID(Payment Recorded)
    RENT_RENEW --> RENT_RENEWED(Contract Renewed Successfully)

    %% ===== RENT OFFERS & PRICING =====
    RENT_ACT --> RENT_OFFERS[Rent Price Offers<br/>View All Pricing Options]
    RENT_OFFERS --> RENT_OFFER_ACT{Offer Type?}
    RENT_OFFER_ACT --> RENT_NORMAL[Create Normal Offer<br/>Monthly/Quarterly/Semi-Annual/Annual]
    RENT_OFFER_ACT --> RENT_SPECIAL[Create Special Offer<br/>Custom Conditions & Discounts]
    RENT_OFFER_ACT --> RENT_PACKAGE[Create Package Offer<br/>Bundled Services]
    RENT_NORMAL --> RENT_OFFER_SAVED(Rent Offer Published)
    RENT_SPECIAL --> RENT_OFFER_SAVED
    RENT_PACKAGE --> RENT_OFFER_SAVED

    %% ===== COLLECTION & RENEWAL =====
    NAV_CHOICE --> COLL_RENEW[Collection & Renewal<br/>Monitor Payment Status]
    COLL_RENEW --> COLL_STATUS{Contract Status?}
    COLL_STATUS --> COLL_VALID(Contract Valid - On Track)
    COLL_STATUS --> COLL_EXPIRING[Contract Expiring Soon<br/>Renewal Action Needed]
    COLL_STATUS --> COLL_EXPIRED[Contract Expired<br/>Immediate Renewal Required]
    COLL_EXPIRING --> COLL_RENEWED(Contract Renewed)
    COLL_EXPIRED --> COLL_RENEWED

    %% ===== CONTRACT CANCELLATION =====
    NAV_CHOICE --> CANCEL[Contract Cancellations<br/>View All Cancellations]
    MED_CANCEL_ACT --> CANCEL
    CANCEL --> CANCEL_REVIEW{Cancellation Review}
    CANCEL_REVIEW --> CANCEL_FEE[Calculate Cancellation Fee<br/>Fee, Refund & Net Amount]
    CANCEL_FEE --> CANCEL_DONE(Contract Cancelled & Refund Processed)
    CANCEL_REVIEW --> CANCEL_APPEAL(Cancellation Appealed)

    %% ===== CONTRACT PENALTIES =====
    NAV_CHOICE --> PENALTIES[Contract Penalties<br/>Track Breaches & Non-Compliance]
    PENALTIES --> PEN_STATUS{Penalty Payment Status?}
    PEN_STATUS --> PEN_PAID(Penalty Paid)
    PEN_STATUS --> PEN_UNPAID(Penalty Outstanding)

    %% ===== CONTRACT DELEGATES =====
    NAV_CHOICE --> DELEGATES[Contract Delegates<br/>Authorization & Delegation]
    DELEGATES --> DEL_STATUS{Delegation Status?}
    DEL_STATUS --> DEL_APPROVED(Delegation Approved)
    DEL_STATUS --> DEL_REJECTED(Delegation Rejected)
    DEL_STATUS --> DEL_PENDING[Under Revision<br/>Awaiting Approval]

    %% ===== AGENT MANAGEMENT =====
    NAV_CHOICE --> AGENTS[Agents<br/>View All Recruitment Agents]
    AGENTS --> AGENT_ACT{Agent Action?}
    AGENT_ACT --> AGENT_ADD[Register New Agent<br/>Name, License, Contact, Nationality]
    AGENT_ACT --> AGENT_EDIT[Edit Agent Profile]
    AGENT_ACT --> AGENT_ASSIGN[Agent Assignment<br/>Assign Work Requests to Agent]
    AGENT_ACT --> AGENT_TRANSFER[Sponsorship Transfer<br/>Transfer Worker Between Sponsors]

    AGENT_ADD --> AGENT_DONE(Agent Registered Successfully)
    AGENT_EDIT --> AGENT_DONE

    AGENT_ASSIGN --> ASSIGN_STATUS{Assignment Status?}
    ASSIGN_STATUS --> ASSIGN_PENDING(Pending - Awaiting Agent)
    ASSIGN_STATUS --> ASSIGN_PROGRESS(In Progress - Agent Working)
    ASSIGN_STATUS --> ASSIGN_COMPLETE(Assignment Completed)
    ASSIGN_STATUS --> ASSIGN_REJECTED(Assignment Rejected by Agent)

    AGENT_TRANSFER --> TRANSFER_STATUS{Transfer Status?}
    TRANSFER_STATUS --> TRANSFER_DONE(Sponsorship Transferred)
    TRANSFER_STATUS --> TRANSFER_TRIAL(Worker in Trial Period)
    TRANSFER_STATUS --> TRANSFER_WARRANTY(Warranty Transferred)
    TRANSFER_STATUS --> TRANSFER_CANCELLED(Transfer Cancelled)

    %% ===== RECRUITMENT =====
    NAV_CHOICE --> RECRUIT[Recruitment<br/>Manage Hiring Pipeline]
    RECRUIT --> RECRUIT_ACT{Recruitment Action?}
    RECRUIT_ACT --> RECRUIT_REQ[Create Recruitment Request<br/>Nationality, Job, Religion, Quantity]
    RECRUIT_ACT --> RECRUIT_VISA[Visa Management<br/>Track All Visas]

    RECRUIT_REQ --> RECRUIT_REVIEW{Request Under Review}
    RECRUIT_REVIEW --> RECRUIT_ACCEPTED[Request Accepted<br/>Assign Worker & Customer]
    RECRUIT_REVIEW --> RECRUIT_REFUSED(Request Refused)
    RECRUIT_ACCEPTED --> RECRUIT_WORKER[Assign Worker to Request]
    RECRUIT_WORKER --> RECRUIT_CUSTOMER[Assign Customer to Request]
    RECRUIT_CUSTOMER --> RECRUIT_DONE(Recruitment Request Fulfilled)

    RECRUIT_VISA --> VISA_STATUS{Visa Status?}
    VISA_STATUS --> VISA_ACTIVE(Visa Active)
    VISA_STATUS --> VISA_PENDING(Visa Pending Approval)
    VISA_STATUS --> VISA_EXPIRED(Visa Expired - Renewal Needed)
    VISA_STATUS --> VISA_CANCELLED(Visa Cancelled)

    %% ===== COMPLAINTS =====
    NAV_CHOICE --> COMPLAINTS[Complaints<br/>View All Open Complaints]
    COMPLAINTS --> COMP_CREATE[Submit New Complaint]
    COMP_CREATE --> COMP_SOURCE{Complaint Source?}
    COMP_SOURCE --> COMP_CUSTOMER[From Customer<br/>Select Customer & Details]
    COMP_SOURCE --> COMP_WORKER[From Worker<br/>Select Worker & Location]
    COMP_SOURCE --> COMP_AGENT[From Agent]
    COMP_SOURCE --> COMP_EMBASSY[From Embassy]
    COMP_SOURCE --> COMP_MINISTRY[From Ministry]
    COMP_SOURCE --> COMP_CONTRACT[From Contract]

    COMP_CUSTOMER --> COMP_ISSUE[Add Issues to Complaint<br/>Authority: Labor Committee, Protection Unit]
    COMP_WORKER --> COMP_ISSUE
    COMP_AGENT --> COMP_ISSUE
    COMP_EMBASSY --> COMP_ISSUE
    COMP_MINISTRY --> COMP_ISSUE
    COMP_CONTRACT --> COMP_ISSUE

    COMP_ISSUE --> COMP_DECISION{Complaint Resolution?}
    COMP_DECISION --> COMP_CLOSED(Complaint Closed - Resolved)
    COMP_DECISION --> COMP_HOLD(Complaint On Hold)

    %% ===== FOLLOW-UP =====
    NAV_CHOICE --> FOLLOWUP[Follow-up Dashboard]
    FOLLOWUP --> FU_TYPE{Follow-up Type?}
    FU_TYPE --> FU_AUTO[Automatic Follow-up<br/>Track All Mediation Contract Stages]
    FU_TYPE --> FU_WARRANTY[Warranty Follow-up<br/>Monitor 90/120 Day Post-Arrival]
    FU_AUTO --> AUTO_FOLLOWUP
    FU_WARRANTY --> WARRANTY_CHECK{Warranty Status?}
    WARRANTY_CHECK --> WARRANTY_ACTIVE(Warranty Active - Monitoring)
    WARRANTY_CHECK --> WARRANTY_EXPIRING(Warranty Expiring Soon)
    WARRANTY_CHECK --> WARRANTY_EXPIRED(Warranty Period Ended)

    %% ===== COMMUNICATION =====
    NAV_CHOICE --> COMM[Communication Center]
    COMM --> COMM_TYPE{Communication Channel?}
    COMM_TYPE --> COMM_EMAIL[Send Email<br/>Compose, Use Templates, Attach Files]
    COMM_TYPE --> COMM_SMS[Send SMS<br/>Select Recipients, Use Templates]
    COMM_TYPE --> COMM_TRACK[SMS Tracking<br/>Configure Auto-Send Triggers]

    COMM_EMAIL --> EMAIL_FILTER[Filter Recipients<br/>By Nationality, Branch, Contract Type]
    EMAIL_FILTER --> EMAIL_SENT(Email Sent Successfully)

    COMM_SMS --> SMS_FILTER[Select SMS Recipients<br/>By Nationality, Branch, Contract Type]
    SMS_FILTER --> SMS_SENT(SMS Delivered)

    COMM_TRACK --> SMS_TRIGGER[Configure Auto-SMS Rules<br/>Process, Medical, Travel Events]
    SMS_TRIGGER --> SMS_AUTO(Automated SMS Active)

    %% ===== REPORTS =====
    NAV_CHOICE --> REPORTS[Reports & Analytics]
    REPORTS --> REPORT_TYPE{Report Type?}
    REPORT_TYPE --> RPT_ARRIVAL[Arrival Reports<br/>Worker Arrival Status, Flights, Ratings]
    REPORT_TYPE --> RPT_ALT[Alternative Reports<br/>Worker Reassignment Tracking]
    REPORT_TYPE --> RPT_GEN[Report Generator<br/>Build Custom Reports by Category]
    REPORT_TYPE --> RPT_PROD[Employee Productivity Reports]

    RPT_ARRIVAL --> RPT_ARRIVAL_STATUS{Arrival Status?}
    RPT_ARRIVAL_STATUS --> ARRIVED(Worker Has Arrived)
    RPT_ARRIVAL_STATUS --> PENDING_ARRIVAL(Pending Arrival)
    RPT_ARRIVAL_STATUS --> RATED(Arrival Rated & Confirmed)

    RPT_GEN --> RPT_SELECT[Select Report Category<br/>Mediation, Arrivals, Workers, City Stats]
    RPT_SELECT --> RPT_GENERATED(Report Generated)

    %% ===== STATISTICS =====
    NAV_CHOICE --> STATS[Statistics & Performance]
    STATS --> STATS_TYPE{Statistics View?}
    STATS_TYPE --> STATS_AGENT[Agent Productivity<br/>Contracts, Response Time, Satisfaction, Revenue]
    STATS_TYPE --> STATS_OFFICE[Office Productivity<br/>Branch Performance Metrics]
    STATS_TYPE --> STATS_FU[Follow-up Statistics]
    STATS_TYPE --> STATS_APPLICANT[Applicant Statistics]
    STATS_TYPE --> STATS_VISA[Visa Statistics]

    STATS_AGENT --> STATS_FILTER[Filter by Branch & Period<br/>Day, Week, Month, Quarter, Year]
    STATS_FILTER --> STATS_VIEW(Performance Dashboard Displayed)

    %% ===== ADMINISTRATION & SETTINGS =====
    NAV_CHOICE --> ADMIN[Administration]
    ADMIN --> ADMIN_TYPE{Admin Area?}

    ADMIN_TYPE --> USERS[User Management<br/>View All System Users]
    USERS --> USER_ACT{User Action?}
    USER_ACT --> USER_ADD[Create User Account<br/>Username, Password, Assign Roles]
    USER_ACT --> USER_EDIT[Edit User & Permissions]
    USER_ACT --> USER_TOGGLE{Activate or Deactivate User}
    USER_ADD --> USER_DONE(User Account Created)
    USER_EDIT --> USER_DONE
    USER_TOGGLE --> USER_ACTIVE(User Activated)
    USER_TOGGLE --> USER_INACTIVE(User Deactivated)

    ADMIN_TYPE --> ROLES[Roles & Privileges<br/>Define Access Levels]
    ROLES --> ROLE_TYPE{Role Type?}
    ROLE_TYPE --> ROLE_EMPLOYEE[Employee Role<br/>Internal Staff Permissions]
    ROLE_TYPE --> ROLE_AGENT[Agent Role<br/>External Agent Permissions]
    ROLE_EMPLOYEE --> ROLE_SAVED(Role Configured & Saved)
    ROLE_AGENT --> ROLE_SAVED

    ADMIN_TYPE --> SETTINGS_GEN[General Settings<br/>Jobs & Nationalities Configuration]
    SETTINGS_GEN --> SET_JOBS[Manage Job Types<br/>Name, Description, Authorization]
    SETTINGS_GEN --> SET_NAT[Manage Nationalities<br/>Name, ISO Codes]
    SET_JOBS --> SET_SAVED(Settings Updated)
    SET_NAT --> SET_SAVED

    ADMIN_TYPE --> SETTINGS_MED[Mediation Settings<br/>Follow-up Status Hierarchies]
    SETTINGS_MED --> SET_MED_FU[Configure Follow-up Stages<br/>Parent & Sub-Statuses by Nationality]
    SET_MED_FU --> SET_SAVED

    ADMIN_TYPE --> SYS_ENTITIES[System Entities<br/>Master Data Management]
    SYS_ENTITIES --> SYS_OPTIONS{Entity Type?}
    SYS_OPTIONS --> SYS_CITIES[Cities & Destinations]
    SYS_OPTIONS --> SYS_AIRLINES[Airline Companies]
    SYS_OPTIONS --> SYS_DOCS[Document Types]
    SYS_OPTIONS --> SYS_MARKETERS[Marketers]
    SYS_OPTIONS --> SYS_TEMPLATES[SMS & Email Settings]
    SYS_CITIES --> SYS_SAVED(Master Data Updated)
    SYS_AIRLINES --> SYS_SAVED
    SYS_DOCS --> SYS_SAVED
    SYS_MARKETERS --> SYS_SAVED
    SYS_TEMPLATES --> SYS_SAVED

    ADMIN_TYPE --> CONTRACT_REQ[Contract Creation Requirements<br/>Define Checklist by Nationality & Job]
    CONTRACT_REQ --> REQ_SAVED(Requirements Configured)

    %% ===== STYLES =====
    classDef startEnd fill:#4CAF50,stroke:#388E3C,color:#fff,stroke-width:2px
    classDef page fill:#2196F3,stroke:#1565C0,color:#fff,stroke-width:1px
    classDef decision fill:#FF9800,stroke:#E65100,color:#fff,stroke-width:1px
    classDef success fill:#66BB6A,stroke:#2E7D32,color:#fff,stroke-width:1px
    classDef warning fill:#FFA726,stroke:#E65100,color:#fff,stroke-width:1px
    classDef danger fill:#EF5350,stroke:#C62828,color:#fff,stroke-width:1px
    classDef workflow fill:#7E57C2,stroke:#4527A0,color:#fff,stroke-width:1px

    class START,DASH startEnd
    class LOGIN,BRANCH,CUST,WORKERS,MED_CONTRACTS,RENT_CONTRACTS,AGENTS,COMPLAINTS,FOLLOWUP,COMM,REPORTS,STATS,ADMIN page
    class AUTH_CHECK,LOGIN_VALID,NAV_CHOICE,BRANCH_ACT,CUST_ACT,WORKER_TAB,W_ACT,MED_ACT,RENT_ACT,AGENT_ACT,RECRUIT_ACT,COMP_SOURCE,COMP_DECISION,FU_TYPE,COMM_TYPE,REPORT_TYPE,STATS_TYPE,ADMIN_TYPE,CONTRACT_TYPE_CHOICE,ASSIGN_STATUS,TRANSFER_STATUS,VISA_STATUS,RECRUIT_REVIEW,RENT_OFFER_ACT,MED_OFFER_ACT,DOC_STATUS,CONTACT_STATUS,W_STATUS_CHANGE,W_AVAIL_FILTER,COLL_STATUS,CANCEL_REVIEW,PEN_STATUS,DEL_STATUS,WARRANTY_CHECK,RPT_ARRIVAL_STATUS,USER_ACT,ROLE_TYPE,SYS_OPTIONS,USER_TOGGLE,MED_RESULT decision
    class BRANCH_DONE,CUST_DONE,W_REGISTERED,MED_CREATED,RENT_CREATED,RENT_PAID,RENT_RENEWED,AGENT_DONE,RECRUIT_DONE,COMP_CLOSED,EMAIL_SENT,SMS_SENT,SMS_AUTO,RPT_GENERATED,STATS_VIEW,USER_DONE,ROLE_SAVED,SET_SAVED,SYS_SAVED,REQ_SAVED,RENT_OFFER_SAVED,MED_OFFER_SAVED,ASSIGN_COMPLETE,TRANSFER_DONE,VISA_ACTIVE,ARRIVED,RATED,CANCEL_DONE,DOC_VALID,CONTACT_DONE,COLL_RENEWED,MED_PASS,PEN_PAID,DEL_APPROVED,WARRANTY_ACTIVE,USER_ACTIVE,COLL_VALID success
    class DOC_EXPIRING,COLL_EXPIRING,WARRANTY_EXPIRING,COMP_HOLD,ASSIGN_PENDING,ASSIGN_PROGRESS,PENDING_ARRIVAL,VISA_PENDING,TRANSFER_TRIAL,TRANSFER_WARRANTY,CONTACT_FOLLOWUP,WARRANTY_START warning
    class DOC_EXPIRED,W_ESCAPED,W_REFUSED,W_SICK,W_DEACTIVATED,MED_FAIL,RECRUIT_REFUSED,VISA_EXPIRED,VISA_CANCELLED,CANCEL_APPEAL,ASSIGN_REJECTED,TRANSFER_CANCELLED,PEN_UNPAID,DEL_REJECTED,WARRANTY_EXPIRED,COLL_EXPIRED,USER_INACTIVE danger
    class FU_MEDICAL,FU_MUSAND,FU_POLO,FU_TESDA,FU_OWWA,FU_BIOMETRIC,FU_VISA,FU_TRAVEL,FU_FLIGHT,FU_ARRIVAL workflow
```
