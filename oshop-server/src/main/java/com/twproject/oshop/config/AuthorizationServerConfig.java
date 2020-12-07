package com.twproject.oshop.config;

import com.twproject.oshop.util.CustomPasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Primary;
import org.springframework.core.Ordered;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;


import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Configuration
@EnableAuthorizationServer
@EnableGlobalMethodSecurity(securedEnabled = true)
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    private final AuthenticationManager authenticationManager;
    private final TokenStore tokenStore;

    @Value("156766490498-ohu9etd14coubkgg29kohchte7417dug.apps.googleusercontent.com")
    private String clientId;
    @Value("KJdwtN_BpffChGG5b5FvEB2h")
    private String secret;
    @Value("oshop")
    private String resourceId;
    @Value("3600")
    private int expiration;
    @Value("10800")
    private int refreshTokenExpiration;

    public AuthorizationServerConfig(
            @Lazy AuthenticationManager authenticationManager,
            TokenStore tokenStore
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenStore = tokenStore;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new CustomPasswordEncoder();
    }

    @Bean
    @Primary
    public DefaultTokenServices tokenServices() {
        DefaultTokenServices tokenServices = new DefaultTokenServices();
        tokenServices.setTokenStore(tokenStore);
        tokenServices.setSupportRefreshToken(true);
        tokenServices.setReuseRefreshToken(false);
        tokenServices.setAccessTokenValiditySeconds(expiration);
        tokenServices.setRefreshTokenValiditySeconds(refreshTokenExpiration);
        return tokenServices;
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer configurer) {
        configurer.addInterceptor(new HandlerInterceptorAdapter() {
            @Override
            public boolean preHandle(HttpServletRequest hsr, HttpServletResponse rs, Object o) throws Exception {
                rs.setHeader("Access-Control-Allow-Origin", "*");
                rs.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
                rs.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token");
                return true;
            }
        }
        )       .authenticationManager(authenticationManager)
                .tokenStore(tokenStore)
                .tokenServices(tokenServices())
                .pathMapping("/oauth_login","/login")
                .pathMapping("/oauth/token", "/login-oshop");
    }

    @Override
    public void configure(AuthorizationServerSecurityConfigurer security) {
        security.tokenKeyAccess("permitAll()").checkTokenAccess("isAuthenticated()");
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        clients.inMemory()
                .withClient(clientId)
                .secret(passwordEncoder().encode(secret))
                .accessTokenValiditySeconds(expiration)
                .refreshTokenValiditySeconds(refreshTokenExpiration)
                .scopes("read", "write")
                .authorizedGrantTypes("password", "refresh_token")
                .resourceIds(resourceId);
    }

    @Bean
    public FilterRegistrationBean filterRegistrationBean() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.addExposedHeader("Filename");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
