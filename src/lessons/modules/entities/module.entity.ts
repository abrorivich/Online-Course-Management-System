import { Course } from "src/course/entities/course.entity";
import { Lesson } from "src/lessons/entities/lesson.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Modules {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", unique: true })
    name: string

    @Column({ type: "varchar" })
    description: string

    @ManyToOne((type) => Course, (course) => course.module)
    @JoinColumn()
    course: Course

    @OneToMany((type) => Lesson, (lesson) => lesson.modules)
    lesson: Lesson[]
}
