package com.crcafe.api.config;

public final class ApiPaths {

    private ApiPaths() {
        // Private constructor to prevent instantiation
    }

    public static final String API_ROOT = "/api";

    // Authentication
    public static final String AUTH_ROOT = API_ROOT + "/auth";
    public static final String AUTH_LOGIN = "/login";
    public static final String AUTH_REFRESH = "/refresh";

    // Dashboard
    public static final String DASHBOARD_ROOT = API_ROOT + "/dashboard";
    public static final String DASHBOARD_SUMMARY = "/summary";
    public static final String DASHBOARD_FINANCIAL_SUMMARY = "/financial-summary";
    public static final String DASHBOARD_SALES_OVER_TIME = "/sales-over-time";
    public static final String DASHBOARD_TOP_SELLING_ITEMS = "/top-selling";
    public static final String DASHBOARD_USERS_PERFORMANCE = "/users-performance";
    public static final String DASHBOARD_RECENT_TRANSACTIONS = "/recent-transactions";

    // Items
    public static final String ITEMS_ROOT = API_ROOT + "/items";

    // Orders
    public static final String ORDERS_ROOT = API_ROOT + "/orders";
    public static final String ORDERS_TODAY_COUNT = "/today-count";
    public static final String ORDERS_MY_DAY_COUNT = "/my-day-count";

    // Users
    public static final String USERS_ROOT = API_ROOT + "/users";
    public static final String USERS_ID = "/{id}";
    public static final String USERS_ME = "/me";

} 