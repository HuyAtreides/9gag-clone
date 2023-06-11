package com.huyphan;

import com.huyphan.controllers.websockethandlers.NotificationEventHandler;
import com.huyphan.models.enums.WebSocketHeader;
import java.util.Map;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;


@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Value("${app.url}")
    private String url;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {

        registry.addHandler(getWebSocketHandler(), "/socket").setAllowedOrigins(url)
                .addInterceptors(new Interceptor());
    }

    private static class Interceptor implements HandshakeInterceptor {

        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
            String protocol = Objects.requireNonNull(
                            request.getHeaders().get(WebSocketHeader.SUB_PROTOCOL.getValue()))
                    .get(0);
            response.getHeaders().add(WebSocketHeader.SUB_PROTOCOL.getValue(), protocol);
            return true;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                WebSocketHandler wsHandler, Exception exception) {

        }
    }

    @Bean
    public WebSocketHandler getWebSocketHandler() {
        return new NotificationEventHandler();
    }
}
