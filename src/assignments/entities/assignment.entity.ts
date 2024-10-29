import { Lesson } from "src/lessons/entities/lesson.entity";
import { Result } from "src/results/entities/result.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Assignment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    name: string

    @Column({ type: "varchar" })
    description: string

    @Column({ type: "int" })
    deadline: number

    @OneToOne(() => Lesson, lesson => lesson.assignment, { onDelete: "CASCADE" })
    @JoinColumn()
    lesson: Lesson;

    @OneToOne(() => Result, result => result.assignment, { onDelete: "CASCADE" })
    result: Result;
}
