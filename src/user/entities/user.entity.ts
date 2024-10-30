import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../dto/create-user.dto";
import { Course } from "src/course/entities/course.entity";
import { Result } from "src/results/entities/result.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", unique: true })
    username: string

    @Column({ type: "varchar",  unique: true})
    email: string

    @Column({ type: "varchar" })
    password: string

    @Column({ type: "int" })
    age: number

    @Column({ type: "varchar" })
    from: string

    @Column({ type: "enum", enum: Role, default: Role.USER })
    role: Role

    @ManyToMany(() => Course, (course) => course.user, { onDelete: "CASCADE" })
    course: Course[];

    @OneToMany(() => Result, (result) => result.user, { onDelete: "CASCADE" })
    result: Result[];
}