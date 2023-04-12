import { PrismaClient } from '@prisma/client'
import express from 'express'
const cors = require("cors");


const prisma = new PrismaClient()
const app = express()
app.use(express.json())
app.use(cors())
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Add New Student 
app.post(`/saveStudent`, async (req, res) => {
  try{
    const result = await prisma.student.create({
        data:req.body ,
    })
    res.json({
        success: true,
        payload: result,
    })
  } 
  catch (error) {
  console.error(error);
  res.status(500).send('Internal server error');
}
})

//update student
app.post(`/updateStudent`, async (req, res) => {
  console.log(req.body)
  try{
    const result = await prisma.student.update({
      where:{
        id : Number(req.body.id)
      },
        data: { ...req.body },
    })
    res.json({
        success: true,
        payload: result,
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

//Save StudentClassMAp
app.post(`/saveStudentClassMap`, async (req, res) => {
  try{
    const result = await prisma.studentClassMap.create({
    data: { ...req.body },
    })
    res.json({
      success: true,
      payload: result,
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

// Get Student List
app.get('/getStudentList', async (req, res) => {
  try{
    const result = await prisma.student.findMany({
      where: {isDeleted : false },
      orderBy:{
        id:'asc'
      }
    })
    res.json({
      success: true,
      payload: result,
      message: "Student List Success",
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

  //Get Student by Id 
  app.get(`/getStudentById/:id`, async (req, res) => {
    try{
      var  results:  { [key: string]: any} = {};
      const { id } = req.params
      const studentInfo = await prisma.student.findFirst({
          where: { id: Number(id) , isDeleted:false},
      })
      const classList = await prisma.studentClassMap.findMany({
        where: { studentId: Number(id) },
        include:{
          // student: true,
          class : true
        },
       })
       //for ddl 
      //  const student = await prisma.student.findUnique({
      //   where: {
      //     id: Number(id),
      //   },
      //   include: {
      //     student: {
      //       include: {
      //         class: true,
      //       },
      //     },
      //   },
      // });
  
      // if (student){
      //   // to get ids they are currently enrolled in
      //   const enrolledClassIds = student.student.map((scm) => scm.classId);
      //   //to get all the classes they are not enrolled in
      //   const classes = await prisma.class.findMany({
      //     where: {
      //       NOT: {
      //         id: {
      //           in: enrolledClassIds,
      //         },
      //       },isDeleted:false,
      //     },
      //   });
      //   results.dropdown = classes
      // }
      // else{
      //   results.dropdown = student
      // }
      results.studentInfo = studentInfo
      results.classList = classList
      res.json({
          success: true,
          payload: results,
      })
    }
    catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
    
})

// Delete student by Id
app.put('/deleteStudent/:id', async (req, res) => {
  try{
    const { id } = req.params
    const result = await prisma.student.update({
        where: { id: Number(id) },
        data: { isDeleted: true },
    })
    const deleteMap = await prisma.studentClassMap.deleteMany({
      where: {
        studentId: Number(id)
      },
    })
    res.json({
        success: true,
        payload: result,
        String:"Deleted"
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
  
})

///----------------Class-----------------------

//Get class list for that student (ddl) for update
app.get('/getClassListByStudent/:id', async (req, res) => {
  const { id } = req.params
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        student: {
          include: {
            class: true,
          },
        },
      },
    });

    if (student){
      // to get ids they are currently enrolled in
      const enrolledClassIds = student.student.map((scm) => scm.classId);
      //to get all the classes they are not enrolled in
      const classes = await prisma.class.findMany({
        where: {
          NOT: {
            id: {
              in: enrolledClassIds,
            },
          },isDeleted:false,
        },
      });
      res.json({
        success: true,
        payload: classes,
        message: "Class List Success",
      });
    }
    else{
      res.json({
        success: true,
        payload: student,
        message: "Class List Empty",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

//Add New Class
app.post(`/saveClass`, async (req, res) => {
  try{
    const result = await prisma.class.create({
      data: { ...req.body },
  })
  res.json({
      success: true,
      payload: result,
  })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
    
})

//update class
app.post(`/updateClass`, async (req, res) => {
  console.log(req.body)
  try{
    const result = await prisma.class.update({
      where:{
        id : Number(req.body.id)
      },
        data: { ...req.body },
    })
    res.json({
        success: true,
        payload: result,
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
  
})

// Get Class List
app.get('/getClassList', async (req, res) => {
  try{
    const result = await prisma.class.findMany({
      where:{isDeleted:false},
      orderBy:{
        id:'asc'
      }
  })
  res.json({
    success: true,
    payload: result,
    message: "Class List Success",
  })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }    
  })

  //Get Class by Id 
  app.get(`/getClassById/:id`, async (req, res) => {
    try{
      var  results:  { [key: string]: any} = {};
    const { id } = req.params
    const classInfo = await prisma.class.findFirst({
        where: { id: Number(id),
             isDeleted :false 
            },
    })
    const studentList = await prisma.studentClassMap.findMany({
        where: { classId: Number(id) },
        include:{
          student: true,
          // class : true
        },
    })
    results.classInfo = classInfo
    results.studentList = studentList
    res.json({
        success: true,
        payload: results,
    })
    }catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
    
})

  // Delete class by Id
app.put('/deleteClass/:id', async (req, res) => {
  try{
    const { id } = req.params
    const result = await prisma.class.update({
        where: { id: Number(id) },
        data: { isDeleted: true },
    })
    const deleteMap = await prisma.studentClassMap.deleteMany({
      where: {
        classId: Number(id)
      },
    })
    res.json({
        success: true,
        payload: result,
        String:"Deleted"
    })
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
})

//----------------------Student Class Map------------------
app.post('/deleteStudentClassMap', async(req, res) => {
  try{
    const { studentId, classId } = req.body;
    const deleteMap = await prisma.studentClassMap.deleteMany({
      where: {
        classId: Number(classId),
        studentId: Number(studentId)
      },
    });
    res.json({
      success: true,
      payload: deleteMap,
      message: "Deleted successfully."
    });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }  
});


// To handle unexpected paths
app.use((req, res, next) => {
    res.status(404);
    return res.json({
      success: false,
      payload: null,
      message: `API SAYS: Endpoint not found for path: ${req.path}`,
    });
  });

  //------------------------------------Trying controller and services----------------------------
//   const classController = require("./controllers/class")


  // TO HOST THE BACKEND
app.listen(3020, () =>
  console.log('REST API server ready at: http://localhost:3020'),
)