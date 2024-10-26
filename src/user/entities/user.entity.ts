import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../dto/create-user.dto";
import { Course } from "src/course/entities/course.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", unique: true })
    username: string

    @Column({ type: "varchar" })
    email: string

    @Column({ type: "varchar" })
    password: string

    @Column({ type: "int" })
    age: number

    @Column({ type: "varchar" })
    from: string

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role

    @ManyToMany(() => Course, (course) => course.user)
    course: Course[];
}