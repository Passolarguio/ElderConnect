package br.com.elderconnect.dto;

/** Formato de erro compartilhado com os frontends Web e Mobile. */
public record ApiError(String message, String code) {
}
