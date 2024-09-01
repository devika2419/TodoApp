import createDatabaseConnection from "./db_connection";
import{v4 as uuid4} from "uuid"
import bcrypt from "bcrypt"
import { RowDataPacket } from "mysql2";

export async function registerUser(username:string, password:string):Promise<string>{
    try {
        console.log("Inside register User");

        const connection = await createDatabaseConnection();

         const userId = uuid4();

         const trimmedPassword = password.trim();

         //bcrypting the password
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(trimmedPassword, saltRounds)

         const query = "INSERT INTO users (user_id, user_name, password) VALUES (?,?,?)"
         const [result] = await connection.execute(query, [userId, username, hashedPassword]);
         console.log(result);

         return userId

        
    } catch (error) {

        console.error("Error registering User in queries.ts", (error as Error).message)
        throw error
        
    }

    


}

export async function checkUser(username:string, password:string):Promise<any>{
    try {
        console.log("Inside check user!")

        const trimmedPassword = password.trim();
    
        const connection = await createDatabaseConnection();
    
        const query = "SELECT * FROM users WHERE user_name = ?";
        const [result] = await connection.execute<RowDataPacket[]>(query,[username]);
    
        if(!result){
            console.log("No username as provided found!");
            return false;
        }
    
        else{
    
            for(const user of result){
                const storedHashedPassword = user.password;
    
                const isPasswordCorrect = await bcrypt.compare(trimmedPassword, storedHashedPassword);
    
                if(isPasswordCorrect){
                    console.log("User found!");
                    console.log(user);
                    return user.user_id
                }
    
                else{
                    console.log("Incorrect password")
                    return false;
    
                }
    
                
            }
        }
        
    } catch (error) {
        console.error('Error checking user:', (error as Error).stack);
        throw error;
        
    }
}

    export async function addTasks(userId:string, task_desc:string):Promise<any>{
        try {
            console.log("Inside add tasks!")
    
            const connection = await createDatabaseConnection();
        
            const query = "INSERT INTO tasks (user_id, task_desc) VALUES (?, ?)";
            const [result] = await connection.execute(query,[userId, task_desc]);
        
            if(!result){
                console.log("Tasks was not added");
                return false;
            }
        
            else{
        
                   console.log("Tasks addded successfully!")
                   return result
                   
                }
            }
            
         catch (error) {
            console.error('Error addidng tasks user:', (error as Error).stack);
            throw error;
            
        }
    }

    export async function completedTasks(userId:string, tasks_id:number,completed:false):Promise<any>{
        try {
            console.log("Inside check tasks!")
    
            const connection = await createDatabaseConnection();
            
              
            const query = "UPDATE tasks SET completed = ? WHERE user_id = ? AND task_id = ?";
            const [result] = await connection.execute(query,[completed, userId, tasks_id]);
            console.log('Query result:', result);  // Log the result for debugging

        
            connection.end();

            if(result){
                console.log("successful task completion!");
                return result
            }
            else{
                console.log("No task completion!");


            }
        }
            
         catch (error) {
            console.error('Error completing tasks user:', (error as Error).stack);
            throw error;
            
        }
    }

    export async function deleteTasks(userId:string, tasks_id:number):Promise<any>{
        try {
            console.log("Inside delete tasks!")
    
            const connection = await createDatabaseConnection();
            
            const query = "DELETE FROM tasks WHERE user_id = ? AND task_id = ?";
            const [result] = await connection.execute(query,[userId, tasks_id]);
            console.log('Query result:', result);  // Log the result for debugging

            connection.end();

        if (result) {
            console.log("Successful task deletion!");
            return true;
        } else {
            console.log("No task deleted. Task may not exist.");
            return false;
        }
        }
            
         catch (error) {
            console.error('Error deleting tasks :', (error as Error).stack);
            throw error;
            
        }
    }
    

    export async function viewTasks(userId:string):Promise<any>{
        try {
            console.log("Inside view tasks!")
    
            const connection = await createDatabaseConnection();
            
                
            const query = "SELECT * FROM tasks WHERE user_id = ?";
            const [result] = await connection.execute(query,[userId]);
            console.log('Query result:', result);  // Log the result for debugging

            connection.end();

        if (result) {
            console.log("Successful task deletion!");
            return result;
        } else {
            console.log("No data obtained.");
            return false;
        }
        }
            
         catch (error) {
            console.error('Error viewing tasks :', (error as Error).stack);
            throw error;
            
        }
    }
    