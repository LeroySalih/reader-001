import SubjectPlan from "./subject-plan";

export default function Layout ({children}: any) {


    return <div>
        <SubjectPlan/>
        <div>{children}</div>
    </div>

}