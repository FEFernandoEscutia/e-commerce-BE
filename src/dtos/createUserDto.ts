import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches, IsInt, IsOptional, IsEmpty, IsBoolean } from 'class-validator';




export class CreateUserDto{
    
    

    @IsNotEmpty()
    @IsString()
    @Length(3, 80)
    @ApiProperty({
        description: "The full name of the user, between 3 and 80 characters long.",
        example: "John Doe",
      })
    name: string;
  
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: "The user's email address. Must be a valid and unique email.",
        example: "johndoe@example.com",
      })
    email: string;
  
    @IsNotEmpty()
    // Ensures the password contains at least one lowercase letter, one uppercase letter, one number, one special character, and is between 8 to 15 characters long.
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/)
    @ApiProperty({
        description: "The user's password. Must contain at least one lowercase, one uppercase, one number, one special character, and be between 8 to 15 characters long.",
        example: "Password@123",
      })
    password: string;
  
    @IsOptional() 
    @IsString()
    @Length(3, 80)
    @ApiProperty({
        description: "The user's optional address, between 3 and 80 characters long.",
        example: "1234 Elm Street",
      })
    address: string;
  
    @IsNotEmpty()
    @IsInt()
    @ApiProperty({
        description: "The user's phone number. Must be a valid integer.",
        example: 1234567890,
      })
    phone: number;
  
    @IsOptional() 
    @IsString()
    @Length(5, 20)
    @ApiProperty({
        description: "The country the user resides in, between 5 and 20 characters long.",
        example: "United States",
      })
    country: string;
  
    @IsOptional() 
    @IsString()
    @Length(5, 20)
    @ApiProperty({
        description: "The city the user resides in, between 5 and 20 characters long.",
        example: "New York",
      })
    city: string;

  
    @IsOptional()
    @IsBoolean() 
    @ApiProperty({
        description: "Indicates if the user has admin privileges. Defaults to false. Only users with the ADMIN role can modify this value. Regular users cannot make any changes to this property.",
        example: false,
      })
    isAdmin:boolean
}

