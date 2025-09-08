package com.tastyload.tastyload.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class SupabaseConfig {
    
    @Value("${supabase.url}")
    private String supabaseUrl;
    
    @Value("${supabase.anon.key}")
    private String supabaseAnonKey;
    
    @Value("${supabase.service.key}")
    private String supabaseServiceKey;
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    public String getSupabaseUrl() {
        return supabaseUrl;
    }
    
    public String getSupabaseAnonKey() {
        return supabaseAnonKey;
    }
    
    public String getSupabaseServiceKey() {
        return supabaseServiceKey;
    }
    
    public String getAuthUrl() {
        return supabaseUrl + "/auth/v1";
    }
    
    public String getApiUrl() {
        return supabaseUrl + "/rest/v1";
    }
}