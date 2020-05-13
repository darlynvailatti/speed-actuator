import { TestTemplate } from "src/models/template/test.template";

export interface ValidationRequestDTO {
    testTemplate: TestTemplate
}

export interface ValidationResponseDTO {
    isValid: boolean,
    causeIfIsNotValid?: string
}