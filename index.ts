import express from 'express';
import cors from "cors"
const app= express();
import { registerUser, checkUser, addTasks, completedTasks, deleteTasks, viewTasks} from './queries';

app.use(express.json());
app.use(cors());


//Register a new user
app.post("/register", async(req, res)=>{
    try {

        const {username, password, confirmPassword} = req.body;
        console.log(req.body);

        if(password !== confirmPassword){
            res.status(200).json({error:"Password Doesn't match, Try Again!"})

        }
        else{
            const userId = await registerUser(username, password);
            if (userId) {
    
                    
                return res.status(201).json({
                    userId: userId
                });
            } 
            else {
                return res.status(500).send("No user generated")
        }

        }

        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to post data' });

        
    }
});

//Login
app.post("/check-user", async(req, res)=>{
    try {

        const {username, password} = req.body;
        console.log(req.body);

        
            const userId = await checkUser(username, password);
            if (userId) {
    
                    
                return res.status(201).json({
                    userId: userId
                });
            } 
            else {
                return res.status(500).send("No user generated")
        

        }

        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to post data' });

        
    }
});

//Add Tasks
app.post("/add-tasks", async(req, res)=>{
    try {

        // const userId = req.query.userId as string; 

       const {userId, tasks} = req.body;

        console.log(req.body);

        const data = await addTasks(userId, tasks)
        console.log("Here is the data:- ", data)
          
            if (data) {
    
                    
                return res.status(201).json({
                    userId: userId,
                    success:true
                });
            } 
            else {
                return res.status(500).send("No task added")
        

        }

        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to post data' });

        
    }
});

//Completed Tasks
app.put("/completed", async(req, res)=>{
    try {


        const {userId,task_id, completed} = req.body;

        console.log("Received userId:", userId);
        console.log("Received tasks_id:", task_id);

        

        if (!userId || isNaN(parseInt(task_id, 10))) {
            return res.status(400).json({ error: 'Invalid userId or taskId provided.' });
        }

        // Convert taskId to an integer
        const taskIdInt = parseInt(task_id, 10);

        console.log("Received tasks_id:", taskIdInt);


        const data = await completedTasks(userId, taskIdInt, completed)
        console.log("Here is the data:- ", data)
          
            if (data) {
        
                return res.status(201).json({
                    userId: userId,
                    success:true
                });
            } 
            else {
                return res.status(500).send("No task completed")
        

        }

        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to complete data' });

        
    }
});

//Delete Tasks
app.delete("/delete", async(req, res)=>{
    try {


        const {userId, task_id} = req.body;

        console.log("Received userId:", userId);
        console.log("Received tasks_id:", task_id);

        

        if (!userId || isNaN(parseInt(task_id, 10))) {
            return res.status(400).json({ error: 'Invalid userId or taskId provided.' });
        }

        // Convert taskId to an integer
        const taskIdInt = parseInt(task_id, 10);

        console.log("Received tasks_id:", taskIdInt);


        const data = await deleteTasks(userId, taskIdInt)
        console.log("Here is the data:- ", data)
          
            if (data) {
        
                return res.status(201).json({
                    userId: userId,
                    success:true
                });
            } 
            else {
                return res.status(500).send("No task completed")
        

        }

        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to complete data' });

        
    }
});

//Show All Tasks
app.get("/view-all", async(req, res)=>{
    try {

        interface Task {
            task_id: number;
            user_id: string;
            task_desc: string;
            completed: number;
            created_at?: string; // Optional field
        }

        const userId = req.query.userId as string; 

        
        console.log("Received userId:", userId);
        
        
        const data = await viewTasks(userId)
        console.log("Here is the data:- ", data)

        const userTasks = data.filter((task: Task) => task.user_id === userId);

            if (userTasks) {
        
                return res.status(201).json({
                    result: userTasks,
                    
                });
            } 
            else {
                return res.status(500).send("No task completed")
        

        }

        
    } catch (error) {
        return res.status(500).json({ error: 'Failed to complete data' });

        
    }
});







app.listen(8000, ()=>{
    console.log("Listening on port 8000")
})

