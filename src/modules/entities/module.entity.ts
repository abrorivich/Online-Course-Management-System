import { Course } from "src/course/entities/course.entity";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Modules {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    name: string

    @Column({ type: "varchar" })
    description: string

    @ManyToOne((type) => Course, (course) => course.module, { onDelete: "CASCADE" })
    @JoinColumn()
    course: Course

    @OneToMany((type) => Lesson, (lesson) => lesson.modules, { onDelete: "CASCADE" })
    lesson: Lesson[]
}
