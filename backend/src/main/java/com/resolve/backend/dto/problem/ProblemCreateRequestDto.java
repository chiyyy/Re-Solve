package com.resolve.backend.dto.problem;

import com.resolve.backend.domain.problem.Difficulty;
import com.resolve.backend.domain.problem.Platform;
import com.resolve.backend.domain.problem.ProblemStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProblemCreateRequestDto {
    @NotBlank(message = "문제 제목은 필수입니다.")
    private String title;
    
    private String url;
    private Platform platform;
    private Difficulty difficulty;
    private String algorithmType;
    private ProblemStatus status;
    private String code;
    private String note;
}
