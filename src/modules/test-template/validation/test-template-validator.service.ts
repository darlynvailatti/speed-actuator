import { Injectable } from "@nestjs/common";
import { ValidationRequestDTO, ValidationResponseDTO } from "./validation.dto";


@Injectable()
export class TestTemplateValidatorService {
    
    
    validate(validationRequest: ValidationRequestDTO) : ValidationResponseDTO {
        try {
            

            return {
                isValid: true,
            }
        } catch (error) {
            throw new Error(`Error on validate TestTemplate ${validationRequest.testTemplate.code}: ${error}`)
        }
    }



}