var bodyContainer=document.getElementById('body-container');
var pauseContainer=document.getElementById('pause-container');
var resume=document.getElementById('resume');
var element=document.getElementById('body-canvas');
var startPage=document.getElementById('startpage');
var playOn=document.getElementById('startplay');
var pausePlay=document.getElementById('pausePlay');
var instructions=document.getElementById('pcinstruction');
var mobileInstruction=document.getElementById('mobileinstruction');
const CANVAS_HEIGHT=window.innerHeight;
const CANVAS_WIDTH=window.innerWidth > 500? 500: window.innerWidth;
startPage.querySelector('img').width=CANVAS_WIDTH;
startPage.querySelector('img').height=CANVAS_HEIGHT;
pauseContainer.querySelector('img').width=CANVAS_WIDTH;
pauseContainer.querySelector('img').height=CANVAS_HEIGHT;
startPage.style.height=CANVAS_HEIGHT;


function getRandom(min,max)
{
    minimum=Math.floor(min);
    maximum=Math.ceil(max);
    return Math.floor((Math.random()*(maximum-minimum))+minimum);
}

class GAME
{
    constructor(element){
        this.canvas=element;
        this.canvas.width=CANVAS_WIDTH;
        this.canvas.height=CANVAS_HEIGHT;
        this.context=element.getContext('2d');
        this.backgroundImage=SPRITES.background;
        this.potHole= SPRITES.potHole;
        this.player= SPRITES.player;
        this.playerLeft= SPRITES.playerLeft;
        this.playerUp=SPRITES.playerUp;
        this.uglyEnemy=SPRITES.uglyEnemy;
        this.flyingEnemy=SPRITES.flyingEnemy;
        this.purpleEnemy=SPRITES.purpleEnemy;
        this.booster1=SPRITES.booster1;
        this.booster2=SPRITES.booster2;
        this.booster3=SPRITES.booster3;
        this.boosterJetpack=SPRITES.boosterJetpack;
        this.drinkingGlass=SPRITES.drinkingGlass;
        this.healthReinstate=SPRITES.healthReinstate;
        this.monsterDeath=AUDIOS.monsterCrash;
        this.enemySiren=AUDIOS.enemySiren;
        this.boosterTypes=[];
        this.boosterType;
        this.boosterArray=[];
        this.platformArray=[];
        this.animatingPlatformArray = [];
        this.yStorage=[];       //storing the y-value of platforms to avoid multiple platforms creation in same row.
        this.yPlatform;            //yValue for new Platform.
        this.score=0;
        this.bonusScore=0;
        this.bullet=0;
        this.bulletArray=[];
        this.platformTypes=[];
        this.obstacleArray=[];
        this.obstacleType;
        this.obstacle=0;
        this.booster=0;
        this.platformType;                          
        this.leftRight=0;                       //flag for giving orientation to doodle on pressing keys or ondevice motion.
        this.xPlatform;                         //x value for newPlatform
        this.checkSum=0;                       // flag to ensure only one obstacle created  at a time.
        this.boosterCheck=0;                //flag to ensure only one booster created  at a time.
        this.doodle;
        this.doodleXchange=0;              //the change in value of X.
        this.spacePressed=0;            //flag to check space pressed for shooting in desktop game.
        this.enemyBulletArray=[];       //array for storing enemy bullet.
        this.startTime=0;             //variable for storing  started new Date()
        this.currentTime=0;           //variable for storing  current new Date()
        this.loopCount=0;             //flag for checking production of enemy bulet one in every defined time period.
        this.chance=3;                //chance to be hit by enemy's bullet for the doodle before dying.
        this.drunkenMode=0;          //flag for checking drunken mode
        this.doodleClicked=0;       //flag for checkin screen tapped or not in mobile game play.
        this.tapTimer;             //variable to store time when the screen is tapped.
        this.tapElapsedTimer;     //variable to store elapsed timer after screen is tapped.
        this.aX;
        this.aY;
        this.theta=[]; //angle between enemy and doodle;
        this.status='isPlaying';
        this.animator;
        this.setUp();
    }

    setUp()
    {
    
        if(localStorage.getItem('Doodle')==null){
            localStorage.setItem('Doodle','0');
        }
        bodyContainer.style.display='none';
        startPage.style.display='block';
        if(CANVAS_WIDTH<500)
        {
        mobileInstruction.style.display='block';
        }
        if(CANVAS_WIDTH>=500)
        {
            instructions.style.display='block';
        }
        playOn.onclick=()=>
        {
            startPage.style.display='none';
            bodyContainer.style.display='block';
            pausePlay.style.display='block';
            instructions.style.display='none';
            mobileInstruction.style.display='none';
            this.init();
            this.newCanvas();
            this.gameLoop();
        }
        

    }
    
    
    
    init()
    {   
        var doodlePlatfixer=105;  //fixing postion of platform which is always formed below doodle when first drawn
        var doodleFixer=150;  //fixer of postion of doodle at first
        this.platformArray.push(new Platform(CANVAS_WIDTH/2,CANVAS_HEIGHT-doodlePlatfixer,this.context,1)); 
        this.yStorage.push(CANVAS_HEIGHT-doodlePlatfixer);
        this.newPlatform();
        this.platformArray.sort((a, b) => {
            return a.yPosition - b.yPosition;
        });
        
        this.doodle= new Doodle(CANVAS_WIDTH/2,CANVAS_HEIGHT-doodleFixer,this.context);
        
        
        
    }

    platformSelect()
    {
        // Platform types
        // 1: Normal
        // 2: Moving
        // 3: Breakable (Go through)
        // 4: Vanishable


        // var highest=800;
        // var higher=600;
        // var medium=400;
        // var lower=200;
        // var lowest=50;
        
        if (this.score >= 800)
        {
            this.platformTypes = [2, 3, 3, 3, 4, 4, 4, 4];
        }
        
        else if (this.score >= 600 && this.score < 800)
        {
            this.platformTypes = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
        }
        
        else if (this.score >= 400 && this.score < 600)
        {
            this.platformTypes = [2, 2, 2, 2, 3, 3, 3, 3,4,4];
        }
        else if (this.score >= 200 && this.score < 400)
        {
            this.platformTypes = [1,1, 2, 2, 2, 3, 3, 3,4,4];
        }

        else if (this.score >= 50 && this.score < 200)
        {
            this.platformTypes = [1, 1, 1, 1,2, 2, 2,4];
        }
        else this.platformTypes = [1];

        this.platformType = this.platformTypes[Math.floor(Math.random()*this.platformTypes.length)];
        
    }

    boosterSelect()
    {
        // Booster types
        // 1: trampoline
        // 2: Spring
        // 3: jetpack
 
        if (this.score >= 800)
        {
            this.boosterTypes = [2, 1, 2, 3, 3];
        }
        
        else if (this.score >= 600 && this.score < 800)
        {
            this.boosterTypes = [1,1,2, 2, 2, 3, 3, 3, 3];
        }
        
        else if (this.score >= 400 && this.score < 600)
        {
            this.boosterTypes = [1,1,4,4,2, 2, 2, 2, 2, 3, 3, 3];
        }
        else if (this.score >= 200 && this.score < 400)
        {
            this.boosterTypes = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2,3];
        }

        else if (this.score >= 50 && this.score < 200)
        {
            this.boosterTypes = [1, 1, 1, 2, 2, 2];
        }
        else this.boosterTypes = [3];

        this.boosterType = this.boosterTypes[Math.floor(Math.random()*this.boosterTypes.length)];
        
    }

    obstacleSelect()
    {
        // obstacles types
        // 1: pothole
        // 2: horizontal moving bugs
        // 3: oscillating bug
        // 4: vertical moving bugs
        // 5: Drunk mode
 
        if (this.score >= 800)
        {
            this.obstacleTypes = [1, 2, 3, 2,2, 4, 4,5,5];
           
        }
        
        else if (this.score >= 600 && this.score < 800)
        {
            this.obstaclesTypes = [1,2, 3, 3, 4, 4,4,5,5,5,6];
           
        }
        
        else if (this.score >= 400 && this.score < 600)
        {
            this.obstaclesTypes = [1,1, 3, 3, 2, 4, 4,5,6];
           
        }
        else if (this.score >= 200 && this.score < 400)
        {
            this.obstaclesTypes = [1 , 2 , 5, 2, 3, 3,4, 4,5,6,6];
            
        }

        else if (this.score >= 50 && this.score < 200)
        {
            this.obstaclesTypes = [1, 1, 2, 2, 4,3,3,4,5,6,6,6];
            
        }
        else this.obstaclesTypes = [1,5];

        this.obstacleType = this.obstaclesTypes[Math.floor(Math.random()*this.obstaclesTypes.length)];
        
    }


    newPlatform()
    {   
        let yValueOffset=50;
        this.platformSelect();
        this.previousY=0;
        for(var i=0;i<5;i++)
        {   
            for(var j=0;j<5;j++)
            {
                this.xPlatform=getRandom(0,CANVAS_WIDTH-yValueOffset);
                this.yPlatform=this.previousY+getRandom(50,65);
                if(this.yPlatform<=CANVAS_HEIGHT)
                {
                if(this.yStorage.indexOf(this.yPlatform)==-1)
                {

                    this.previousY=this.yPlatform;
                    this.yStorage.push(this.yPlatform); 
                    this.platforms=new Platform(this.xPlatform,this.yPlatform,this.context,this.platformType);
                    if(this.platforms.removeOverlap(this.platformArray))          //checking whether overlapped steps created or not and neglecting overlapped ones.
                    {
                        this.platformArray.push(this.platforms);
                    }
                }
            }
        }
        }
       
    
    }
    

    newObstacle()
    {
        this.obstacleSelect();
        let yValueOffset=50;
        var x=getRandom(0,CANVAS_WIDTH-yValueOffset);
        var y=this.platformArray[0].yPosition-getRandom(60,75);
        if(this.obstacleType==1)
        {
        this.obstacle=new Obstacle(this.potHole,x,y,this.context,this.obstacleType);
        }
        if(this.obstacleType==2)
        {
            
            this.obstacle=new Obstacle(this.uglyEnemy,x,y,this.context,this.obstacleType);
            
            
        }
        if(this.obstacleType==3)
        {
            this.obstacle=new Obstacle(this.purpleEnemy,x,y,this.context,this.obstacleType);
            
        }
        if(this.obstacleType==4)
        {
            
            this.obstacle=new Obstacle(this.flyingEnemy,x,y,this.context,this.obstacleType);
            
            
        }
        if(this.obstacleType==5){
            this.obstacle=new Obstacle(this.drinkingGlass,x,y,this.context,this.obstacleType);
           
        }
        if(this.obstacleType==6)
        {
            this.obstacle=new Obstacle(this.healthReinstate,x,y,this.context,this.obstacleType);
           
        }

        this.obstacleArray.push(this.obstacle);

    }

    

    newBooster()
    {
        this.boosterSelect();
        let yValueOffset=50;
        let x=getRandom(0,CANVAS_WIDTH-yValueOffset);
        let y=this.platformArray[0].yPosition-getRandom(60,75);
        
        if(this.boosterType==1)
        {
        this.booster=new Booster(this.booster1,x,y,this.context,this.boosterType);
        }

        if(this.boosterType==2)
        {
            
            this.booster=new Booster(this.booster2,x,y,this.context,this.boosterType);
            
            
        }

        if(this.boosterType==3)
        {
            this.booster=new Booster(this.booster3,x,y,this.context,this.boosterType);
            
        }        
        
        this.boosterArray.push(this.booster);

    }



    newCanvas()   //reseting the canvas
    {   
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.context.fillStyle='black';     
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.context.drawImage(this.backgroundImage,0,0,this.canvas.width,this.canvas.height);
    }

    
    
    eventHandler()
    {                //detect the alteration of direction with A and D key.
    
        document.onkeydown=(event)=>
        {
            
            
            if(event.code=='KeyA')
            { 
               
                if(this.drunkenMode==0)
                {
                    this.doodleXchange=-5.5;
                }
                else
                {
                    if(this.score<200)
                    {
                        this.doodleXchange=-6.5;
                    }
                    if(this.score>=200)
                    {
                        this.doodleXchange=-5.5;
                    }
                }
                this.leftRight=1;
                
            }
            

            if (event.code=='KeyD')
            {
                
                if(this.drunkenMode==0)
                {
                    if(this.drunkenMode==0)
                    {
                        this.doodleXchange=5.5; 
                    }
                }
                else{
                    if(this.score<200)
                    {
                        this.doodleXchange=6.5;
                    }
                    if(this.score>=200)
                    {
                        this.doodleXchange=5.5;
                    }                
                }
                this.leftRight=0;
                
            }
            

            if(event.code=='Space')
            {  
                 //event listener for bullet  originated by pressing 'Space'
                 
                 this.leftRight=2;
                if(this.spacePressed==0)
                {
                this.bullet=new Bullet(this.doodle.x+this.doodle.width/2,this.doodle.y,this.context);
                this.bulletArray.push(this.bullet);
                this.spacePressed=1;
                }
            }

            
        }

        
        pausePlay.onclick=()=>{
            
            if(this.status=='isPlaying')
            {
                this.status='notPlaying';
                bodyContainer.style.display='none';
                pauseContainer.style.display='block';
            }
            
        }

        resume.onclick=()=>{
            if(this.status=='notPlaying')
            {
                bodyContainer.style.display='block';
                pauseContainer.style.display='none';
                this.status='isPlaying';
            }
        }
        var currentTimer=new Date();
        
        element.onmousedown= ()=>
        {   
            this.leftRight=2;
            this.doodleClicked=1;  
            this.bullet=new Bullet(this.doodle.x+this.doodle.width/2,this.doodle.y,this.context);
            this.bulletArray.push(this.bullet);
            this.tapTimer=new Date();
            
        }

        
        
       
        document.onkeyup=(event)=>{  
               //returning to the original picture of the doodle which is facing towards right.
            
               
            if(event.code=='KeyA' || event.code=='Space')
            {
                //this.accelerometerFlag=true;
                this.leftRight=0;
            }

            if(event.code=='Space'){
                this.spacePressed=0;
            }
            
            if(event.code=='KeyA' || event.code=='KeyD')
            {   //this.accelerometerFlag=true;
                if(this.drunkenMode==0)
                {
                    this.doodleXchange=0;
                }
                
                
            }
            
        }
        if(window.DeviceMotionEvent!=undefined && CANVAS_WIDTH<500)
        {
            
             window.ondevicemotion=(event)=>{
                this.aX = event.accelerationIncludingGravity.x*10;
                this.aY = event.accelerationIncludingGravity.y*10;
                
                if (this.aY <0) 
                {
                    this.aX = -this.aX - 180;
                    
                }
            
                if(this.aX>15 && this.aX<97)
                {
                    if(this.drunkenMode==0)
                        {
                            this.doodleXchange=-3.75;
                            
                        }
                        else
                        {
                            if(this.score<200)
                            {
                                this.doodleXchange=-5.2;
                            }
                            if(this.score>=200)
                            {
                                this.doodleXchange=-5;
                            }
                        }
                        if(this.doodleClicked==0)
                        {
                        this.leftRight=1;
                        }
                }
                if(this.aX>-12 && this.aX<-5)
                {
                    
                    if(this.drunkenMode==0)
                    {
                        
                        this.doodleXchange=0;
                        
                    }
                    if(this.doodleClicked==0)
                    {
                        this.leftRight=0;
                    }
                    
                }
                if(this.aX>5 && this.aX<12)
                {
                    
                    if(this.drunkenMode==0)
                    {
                        
                        this.doodleXchange=0;
                        
                    }
                    if(this.doodleClicked==0)
                    {
                        this.leftRight=1;
                    }
                }
                if(this.aX<-15 && this.aX>-97 )
                {
                    if(this.drunkenMode==0)
                        {
                            
                            this.doodleXchange=3.75;
                        }
                        else
                        {
                            if(this.score<200)
                            {
                                this.doodleXchange=5.2;
                            }
                            if(this.score>=200)
                            {
                                this.doodleXchange=5;
                            }
                        }
                        if(this.doodleClicked==0)
                        {
                        this.leftRight=0;
                        }
                }
                if(this.aX<-25 || this.aX>25)
                {
                    this.doodleClicked=0;
                }
        
             }
             
            
        }
        
            
        
    }
    
    

    
    


    doodleChecker()
    
    {  //checks if doodle is outside the canvas and draw on the other side
        if(this.doodle.x>CANVAS_WIDTH)
        {
            this.doodle.x=0;
        }
        if(this.doodle.x+this.doodle.width<0)
        {
            this.doodle.x=CANVAS_WIDTH-this.doodle.width;
        }
    }
    
    
    platformAlternate()
    
    { //Alternate platform after the platform 4 is spliced off.
        for( let k=0;k<this.platformArray.length;k++)
        {
        if((this.platformArray[k].jumpCount==1 && this.platformArray[k].platformType==4) || (this.platformArray[k].fakePlatDetect==1 && this.platformArray[k].platformType==3))
                {
                    if(this.platformArray[k].platformType==3)
                    {
                        this.animatingPlatformArray.push(this.platformArray[k]);
                        this.fakePlatAnimation(this.platformArray[k]);
                    }
                    this.platformArray.splice(k,1);
                    k--;
                    this.newY=this.platformArray[0].yPosition-getRandom(60,70);
                    if(this.obstPlatOverlap(this.newY)==0){
                        this.newY=this.newY-50;
                    }
                    if(this.obstPlatOverlap(this.newY)==1)
                    {
                        this.newY=this.newY-60;
                    }
                    if(this.obstPlatOverlap(this.newY)==2)
                    {
                        this.newY=this.newY+35;
                    }
                    
                    if(this.boosterArray.length!=0)
                    {
                        let boostCheck=this.boosterPlatOverlap(this.newY)
                        
                    if(boostCheck==0)
                    {   
                        
                        this.newY=this.newY-35;
                    }
                    else if(boostCheck==1)
                    {
                        
                        this.newY=this.newY-50;
                    }
                    else if(boostCheck==2)
                    {
                        
                        this.newY=this.newY+30;
                    }
                    else{
                        this.newY=this.newY;
                    }
                    }
                    this.platformType=getRandom(2,4);
                    if( this.score<300 && this.platformArray[0].platformType==this.platformArray[1].platformType && this.platformType==3 && this.platformArray[0].platformType==this.platformType){
                        this.platformType=2;
                    }
                    this.platformArray.splice(0,0,new Platform(getRandom(0,CANVAS_WIDTH-50), this.newY, this.context,this.platformType));
        
                }
        }
    }

    obstPlatOverlap(y) // checking overlap between obstacles and platform 
    
    {
        let yValue=y;
        for(let m=0;m<this.obstacleArray.length;m++)
        {
            if(yValue<=this.obstacleArray[m].y && yValue+this.platformArray[0].platformHeight>=this.obstacleArray[m].y)
            {
                
                return 0;
            }

            if(yValue>=this.obstacleArray[m].y && yValue<=this.obstacleArray[m].y+this.obstacleArray[m].height)
            {
                
                return 1;
            }

             if(yValue<=this.obstacleArray[m].y+this.obstacleArray[m].height && yValue>this.obstacleArray[m].y)
            {
                
                return 2;
            }
        break;
        }
 
    }

    boosterPlatOverlap(y) //checking the overlap between booster and jumping platform.
    
    {
        let yValue=y;
        for(let m=0;m<this.boosterArray.length;m++)
        {
            if(yValue<=this.boosterArray[m].y && yValue+this.platformArray[0].platformHeight>=this.boosterArray[m].y)
            {
                
                return 0;
            }

            if(yValue>=this.boosterArray[m].y && yValue<=this.boosterArray[m].y+this.boosterArray[m].height)
            {
                
                return 1;
            }

             if(yValue<=this.boosterArray[m].y+this.boosterArray[m].height && yValue>this.boosterArray[m].y)
            {
                
                return 2;
            }
        
        }
 
    }
    
    obstacleSplice(){ //splicing of obstacles after it crosses vertical end of screen.
        for(let n=0;n<this.obstacleArray.length;n++){
            if(this.obstacleArray[n].y>CANVAS_HEIGHT)
            {
                this.enemySiren.pause();
                this.enemySiren.currentTime=0;
                this.obstacleArray.splice(n,1);
                n--;
                
            }
        }
    }

    boosterSplice(){  //splicing the booster after it crosses vertical end of screen
        for(let n=0;n<this.boosterArray.length;n++){
            if(this.boosterArray[n].y>CANVAS_HEIGHT)
            {
                this.boosterArray.splice(n,1);
                n--;
            }
        }
    }

    obstaclewiseMotion()  //every obstacles have different motion and one of them is static too.
    {
        for(let k=0;k<this.obstacleArray.length;k++){
            this.obstacleArray[k].individualMotion();
        }
    }

    bulletObstacleCollide() //collision of doodle's bullet with enemy.
    {
        for(let i =0;i<this.bulletArray.length;i++){
            for(let j=0;j<this.obstacleArray.length;j++){
                if(this.obstacleArray[j].type!=1 && this.obstacleArray[j].type!=5 && this.obstacleArray[j].type!=6 )
                {
                if((this.bulletArray[i].yCentre-this.bulletArray[i].radius)<=(this.obstacleArray[j].y+this.obstacleArray[j].height) && (this.bulletArray[i].yCentre-this.bulletArray[i].radius)>=(this.obstacleArray[j].y)  && this.bulletArray[i].xCentre>this.obstacleArray[j].x && this.bulletArray[i].xCentre<this.obstacleArray[j].x+this.obstacleArray[j].width)
                {
                    if(this.obstacleArray[j].type!=6)
                    {
                        this.bonusScore=this.bonusScore+50;
                    }
                    this.enemySiren.pause();
                    this.enemySiren.currentTime=0;
                    this.obstacleArray.splice(j,1);

                    j--;
                    this.bulletArray.splice(i,1);
                    i--;
                    
                    this.monsterDeath.currentTime=0;
                    this.monsterDeath.play();
                }
                }
            }
        }
    }


    obstacleDoodlePath() //vector implementation for initial path of enemy's bullet.
    {   
        
        for(let k=0; k<this.obstacleArray.length;k++){
            if(this.obstacleArray[k].type!=1 && this.obstacleArray[k].type!=5 && this.obstacleArray[k].type!=6 && (this.doodle.y-this.obstacleArray[k].y-this.obstacleArray[k].height)<CANVAS_HEIGHT/2+100 && (this.doodle.y-this.obstacleArray[k].y-this.obstacleArray[k].height)>=50)
            {
                
                var theta=Math.atan2(this.doodle.y-(this.obstacleArray[k].y+this.obstacleArray[k].height),this.doodle.x+this.doodle.width/2-this.obstacleArray[k].x-this.obstacleArray[k].width/2)
                this.enemyBullet=new Bullet(this.obstacleArray[k].x+this.obstacleArray[k].width/2,this.obstacleArray[k].y+this.obstacleArray[k].height,this.context);
                this.enemyBulletArray.push(this.enemyBullet);
                this.theta.push(theta);
                
            }
            }
    }
    

    enemyShotDoodle() //doodle hit by the enemy's bullet
    {
        let doodleYoffset=20;
        let doodleXoffset=10;
        for(let h=0;h<this.enemyBulletArray.length;h++)
        {
            if(this.enemyBulletArray[h].xCentre+this.enemyBulletArray[h].radius>=this.doodle.x+doodleXoffset && this.enemyBulletArray[h].xCentre-this.enemyBulletArray[h].radius<=this.doodle.x+this.doodle.width-doodleXoffset && this.enemyBulletArray[h].yCentre+this.enemyBulletArray[h].radius>this.doodle.y+doodleYoffset && this.enemyBulletArray[h].yCentre+this.enemyBulletArray[h].radius<=this.doodle.y+this.doodle.height ){
               
                if(this.chance!=0)
                {
                    this.chance=this.chance-1;
                }
                if(this.chance==0)
                {   
                    this.enemySiren.pause();
                    this.monsterDeath.play();
                    this.gameOver();

                    
                }
                
                this.enemyBulletArray.splice(h,1);
                this.theta.splice(h,1);
                h--;
                //this.loopCount=0;
                break;
            }
        }
    }

    
    bulletBulletCollision() //collision of enemy's and doodle's bullet
    {
        for(let r=0;r<this.bulletArray.length;r++)
        {
            for(let t=0;t<this.enemyBulletArray.length;t++)
            {
                if(this.bulletArray[r].xCentre+this.bulletArray[r].radius>=this.enemyBulletArray[t].xCentre-this.enemyBulletArray[t].radius && this.bulletArray[r].xCentre-this.bulletArray[r].radius<=this.enemyBulletArray[t].xCentre+this.enemyBulletArray[t].radius && this.bulletArray[r].yCentre-this.bulletArray[r].radius<=this.enemyBulletArray[t].yCentre+this.enemyBulletArray[t].radius && this.bulletArray[r].yCentre-this.bulletArray[r].radius>=this.enemyBulletArray[t].yCentre-this.enemyBulletArray[t].radius )
                {
                    this.bulletArray.splice(r,1);
                    r--;
                    this.enemyBulletArray.splice(t,1);
                    this.theta.splice(t,1);
                    t--;
                    
                    //this.loopCount=0;
                    this.bonusScore=this.bonusScore+100;
                    
                    
                }
            }
        }
    }

    enemyWarning()
    {
        for(let j=0;j<this.obstacleArray.length;j++)
        {
            if(this.obstacleArray[j].type==2 || this.obstacleArray[j].type==3 || this.obstacleArray[j].type==4)

            {
                if(Math.abs(this.doodle.y-(this.obstacleArray[j].y+this.obstacleArray[j].height/2))<=CANVAS_HEIGHT/2+100)
                {
                    
                    this.enemySiren.play();
                }
                
            }
        }
    }

    fakePlatAnimation(value)
    {   
        let platform=value
        let animatePlat=setInterval(()=>{
                    platform.index = (platform.index+1)%4;
                    if(platform.index==3)
                    {
                        clearInterval(animatePlat);
                    }

                },65
                );
    }
      
    gameOver()
    {
        this.status='notPlaying';
        pausePlay.style.display='none';
        //this.clearRect()
        cancelAnimationFrame(this.animator);
        this.enemySiren.pause();
        this.enemySiren.currentTime=0;
        if(this.score>localStorage.getItem('Doodle')){
            
            
            localStorage.removeItem('Doodle');
            localStorage.setItem('Doodle',`${this.score}`);
           
        }
        this.playAgain=document.getElementById('playagain');
        
        
        this.playAgain.style.display='block';
        this.context.save();
        this.context.font="30px Doodle";
        this.context.fillStyle='yellow';
        this.context.textAlign='center';
        this.context.fillText(`Score: ${this.score}`,CANVAS_WIDTH/2,250);
        this.context.font="30px Doodle";
        this.context.fillStyle='yellow';
        this.context.textAlign='center';
        this.context.fillText(`Bonus: ${this.bonusScore}`,CANVAS_WIDTH/2,290);
        this.context.font="30px Doodle";
        this.context.fillStyle='yellow';
        this.context.textAlign='center';
        this.context.fillText(`Total: ${this.bonusScore+this.score}`,CANVAS_WIDTH/2,330);
        this.context.font="30px Doodle";
        this.context.fillStyle='yellow';
        this.context.textAlign='center';
        this.context.fillText('High Score: '+localStorage.getItem('Doodle'),CANVAS_WIDTH/2,370);
        this.context.restore();
        this.playAgain.onclick=()=>
        {
            this.playAgain.style.display='none';
            this.restartGame();
           
        }
        
    }

    restartGame()
    {
        this.boosterTypes=[];
        this.boosterArray=[];
        this.platformArray=[];
        this.animatingPlatformArray = [];
        this.yStorage=[];       //storing the y-value of platforms to avoid multiple platforms creation in same row.
        this.score=0;
        this.bonusScore=0;
        this.bullet=0;
        this.bulletArray=[];
        this.platformTypes=[];
        this.obstacleArray=[];
        this.leftRight=0;
        this.checkSum=0;
        this.boosterCheck=0;
        this.doodleXchange=0;
        this.spacePressed=0;
        this.enemyBulletArray=[];
        this.startTime=0;
        this.currentTime=0;
        this.loopCount=0;
        this.chance=3;
        this.drunkenMode=0;
        pausePlay.style.display='block';
        this.theta=[]; 
        this.status='isPlaying';
        this.setUp();

    }
    

    gameLoop()
    {               //main drawing and updating code for the game.
        this.newCanvas();
        
        this.eventHandler();
        this.tapElapsedTimer=new Date();
        if(this.tapTimer!=undefined)
        {
            if(this.tapElapsedTimer-this.tapTimer<=650)
            {
                this.leftRight=2;
            }
        }
        this.animator=window.requestAnimationFrame(()=>this.gameLoop());
        
      
        

        if(this.status=='isPlaying')
        {
            
            this.context.fillStyle='rgba(192,192,192,0.7)';
            this.context.fillRect(0,0,CANVAS_WIDTH,50);
            this.context.font="30px Doodle";
            this.context.fillStyle='red';
            this.context.fillText(`${this.score}`,20,34);
            this.context.font="20px Doodle";
            this.context.fillStyle='black';
            this.context.fillText(`Chance: ${this.chance}`,75,32);
            this.context.font="20px Doodle";
            this.context.fillStyle='black';
            this.context.fillText(`Bonus Score: ${this.bonusScore}`,160,32);
            
            for(let i=0;i<this.platformArray.length;++i)
            {
                this.platformArray[i].drawPlatform();
                
            }
        
        for(let i=0;i<this.platformArray.length;++i)
        {
            this.platformArray[i].platformSpeed(this.score);
            this.platformArray[i].movePlatform();
            
        }

        
              
        
        this.doodle.doodleJumpSpeed(this.score);
        this.doodle.jump(this.platformArray,this.boosterArray);
        this.doodle.moveDoodle(this.doodleXchange); 
        this.doodleChecker();  
        
        
        if(this.doodle.direction=='isFalling' && this.doodle.boostJetpack==1)
        {
            this.doodle.boostJetpack=0;
        }
        
        if(this.doodle.boostJetpack==0)
        {
            if(this.leftRight==1)
            {
                this.doodle.drawDoodle(this.playerLeft,this.leftRight);
                
            }
        
            else if(this.leftRight==0)
            {
                this.doodle.drawDoodle(this.player,this.leftRight);
            }

            else if(this.leftRight==2)
            {
                this.doodle.drawDoodle(this.playerUp,this.leftRight);
            }
        }

       else
        {
            this.doodle.drawDoodle(this.boosterJetpack,3);
        }
        
        
        
        if(this.bulletArray.length!=0)
        {
            for(let i=0;i<this.bulletArray.length;++i){
                this.bulletArray[i].bulletMove(0,'isDoodle');
                this.bulletArray[i].bulletDraw('isDoodle');
                if(this.bulletArray[i].yCentre+this.bulletArray[i].radius<0){
                    this.bulletArray.splice(i,1);
                  
                    i--;
                }
            }
        
        }

        

        if(this.score>0  && this.score%19==0 && this.checkSum==0)
        
        {
            
                this.newObstacle();
                this.checkSum=1;

        }
        

        

        if(this.obstacleArray.length!=0)
        {
            for(let j=0;j<this.obstacleArray.length;j++)
            {
                this.obstacleArray[j].drawObstacle();
            }
    
        }

        
        
        
        if(this.obstacleArray.length!=0)
        {
            if(this.loopCount==0)
            
            {
                this.obstacleDoodlePath();
                this.startTime=new Date();
                this.loopCount=1;
            }
            else if(this.loopCount==1)
            {   

                this.currentTime=new Date();
                if(this.currentTime-this.startTime>=1000 && this.currentTime-this.startTime<=1050 && this.score<=250){
                    this.obstacleDoodlePath();
                    this.startTime=new Date();
                }
                else if(this.currentTime-this.startTime>=700 && this.currentTime-this.startTime<=750 && this.score>250)
                {
                    this.obstacleDoodlePath();
                    this.startTime=new Date();
                }
            }

        }
        else{
            this.loopCount=0;
        }
          
            
        

        
        if(this.enemyBulletArray.length!=0)
        {
            for(let i=0;i<this.enemyBulletArray.length;++i){
                this.enemyBulletArray[i].bulletMove(this.theta[i],'isEnemy');
                this.enemyBulletArray[i].bulletDraw('isEnemy');
                if(this.enemyBulletArray[i].yCentre-this.enemyBulletArray[i].radius>CANVAS_HEIGHT || this.enemyBulletArray[i].xCentre+this.enemyBulletArray[i].radius<0 || this.enemyBulletArray[i].xCentre-this.enemyBulletArray[i].radius>CANVAS_WIDTH ){
                    this.enemyBulletArray.splice(i,1);
                    this.theta.splice(i,1);
                    i--;
                }
            }
        
        }

        

        if(this.score>0  && this.score%43==0 && this.boosterCheck==0)
        
        {
            
                this.newBooster();
                this.boosterCheck=1;

        }

        

        if(this.boosterArray.length!=0)
        {
            
            for(let l=0;l<this.boosterArray.length;l++)
            {
                this.boosterArray[l].drawBooster();
            }
        }

        this.platformAlternate();
        
        if(this.doodle.y<=(CANVAS_HEIGHT/2)+1 && this.doodle.offset < 0)
        {  
            if(this.enemyBulletArray.length!=0)
            {
                for(let z=0;z<this.enemyBulletArray.length;z++)
                {
                   this.enemyBulletArray[z].yCentre+=-this.doodle.offset;
                }
            }
            
            if(this.obstacleArray.length!=0)
            {
                for(let k=0;k<this.obstacleArray.length;k++)
                {
                this.obstacleArray[k].moveDownObstacle(this.doodle.offset);
                }
            }

            

            if(this.boosterArray.length!=0)
            {
                for(let o=0;o<this.boosterArray.length;o++)
                {
                this.boosterArray[o].moveDownBooster(this.doodle.offset);
                }
            }

            if(this.animatingPlatformArray.length!=0)
            {
                for(let c=0;c<this.animatingPlatformArray.length;c++)
                {
                    this.animatingPlatformArray[c].yPosition+=-this.doodle.offset;
                }
            }
    
            for( let k=0;k<this.platformArray.length;k++)
            {   
                this.platformArray[k].yPosition+=-this.doodle.offset;
                if(this.platformArray[k].yPosition>=CANVAS_HEIGHT)
                {   
                    
                    this.checkSum=0;
                    this.boosterCheck=0;
                    
                    this.newY=this.platformArray[0].yPosition-getRandom(50,70);
                    if(this.obstacleArray.length!=0)
                    {
                        let overlapCheck=this.obstPlatOverlap(this.newY)
                        
                    if(overlapCheck==0)
                    {   
                       
                        this.newY=this.newY-35;
                    }
                    else if(overlapCheck==1)
                    {
                        
                        this.newY=this.newY-50;
                    }
                    else if(overlapCheck==2)
                    {
                       
                        this.newY=this.newY+30;
                    }
                    else{
                        this.newY=this.newY;
                    }
                    }

                    if(this.boosterArray.length!=0)
                    {
                        let boostCheck=this.boosterPlatOverlap(this.newY)
                        
                    if(boostCheck==0)
                    {   
                        
                        this.newY=this.newY-35;
                    }
                    else if(boostCheck==1)
                    {
                        
                        this.newY=this.newY-50;
                    }
                    else if(boostCheck==2)
                    {
                        
                        this.newY=this.newY+30;
                    }
                    else{
                        this.newY=this.newY;
                    }
                    }
                    this.platformArray.splice(k,1);
                    if(this.score<300 && this.platformArray[0].platformType==this.platformArray[1].platformType && this.platformType==3 && this.platformArray[0].platformType==this.platformType){
                        this.platformType=2;
                    }
                    this.platformArray.splice(0,0,new Platform(getRandom(0,CANVAS_WIDTH-50), this.newY, this.context,this.platformType));
                    this.score+=1;
                }
                
            }
            

        }

        this.enemyWarning(); 
        var value=this.doodle.obstacleCollision(this.obstacleArray);
       
        if(value==0)
        {

            this.gameOver();
        }
        if(value==1)
        {
            this.drunkStart=new Date();
            this.drunkenMode=1;
        }
        else if(value==2){
            this.chance=3;
           
        }

        this.drunkNow=new Date();
        if(this.drunkNow-this.drunkStart>=10000 && this.drunkNow-this.drunkStart<=10050)
        {
            this.drunkenMode=0;
            
        }
        




        
        this.obstaclewiseMotion();
        
        
        if(this.doodle.y+this.doodle.height>=CANVAS_HEIGHT)
        {
        
            this.monsterDeath.play();
            this.gameOver();
    
        }
        

        if(this.obstacleArray.length!=0 && this.bulletArray!=0)
        {   
            this.bulletObstacleCollide();
        }

        if(this.enemyBulletArray.length!=0)
        {

            this.enemyShotDoodle();
        }

        if(this.enemyBulletArray.length!=0 && this.bulletArray!=0){
            this.bulletBulletCollision();
        }

        this.platformSelect();
        this.obstacleSplice();
        this.boosterSplice();
        
        for(let i = 0; i < this.animatingPlatformArray.length; i++)
        {
            this.animatingPlatformArray[i].drawPlatform();
            if(this.animatingPlatformArray[i].index ==3){
                this.animatingPlatformArray.splice(i, 1);
            }
        }

        if(this.drunkenMode==1)
        {
            //console.log('drawn');
            this.context.save();
            this.context.font="30px Arial";
            var fontY=70;
            this.context.textAlign='center';
            this.context.fillStyle='YELLOW';
            this.context.fillText("Drunk Mode",CANVAS_WIDTH/2,fontY);
            this.context.restore();
        }


        
    }
    
}

}

let assetsStillLoading = 0;
let assetsLoader;
let numAssets;
let loadedPercent;
const AUDIOS = {};
const SPRITES = {};
let ctx = document.getElementById('body-canvas').getContext('2d');
ctx.canvas.width=CANVAS_WIDTH;
ctx.canvas.height=CANVAS_HEIGHT;


function assetsLoadingLoop(callback) {

    loadedPercent=((numAssets-assetsStillLoading)/numAssets)*100;
    ctx.beginPath();
    ctx.fillStyle='black';
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    ctx.textAlign="center";
    ctx.fillStyle='white';
    ctx.font="30px Doodle";
    ctx.fillText('Loading.....',CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
    ctx.fillStyle='#2dd';
    ctx.font="30px Doodle";
    ctx.fillText(`${parseInt(loadedPercent)}%`,CANVAS_WIDTH/2,CANVAS_HEIGHT/2+40);
    ctx.beginPath();
    //console.log(assetsStillLoading);

    if(assetsStillLoading == 0){
        callback();
        window.cancelAnimationFrame(assetsLoader);
    }else{
        assetsLoader = window.requestAnimationFrame(()=>assetsLoadingLoop(callback));
    }
}

function loadAssets(callback) 
{     //once this function finishes to load all assets this callback function gets activated

    function loadSprite(fileName) {
      assetsStillLoading++;
  
      let spriteImage = new Image();
      spriteImage.src = fileName;
  
      spriteImage.onload = function() {
        assetsStillLoading--;
      }

      spriteImage.onerror = function() {
          assetsStillLoading--;
      }
      
  
      return spriteImage;
    }

    function loadAudio(fileName){
        assetsStillLoading++;

        let audio = new Audio(fileName);
        audio.oncanplaythrough = function(){
            assetsStillLoading--;
            
            
        };
        return audio;
    }
  
  //Audio loading.  
    AUDIOS.bullet = loadAudio('sounds/bullet.mp3');
    AUDIOS.jump=loadAudio('sounds/jump.wav');
    AUDIOS.monsterCrash=loadAudio('sounds/monster-crash.mp3');
    AUDIOS.enemySiren=loadAudio('sounds/enemySound.mp3');
    AUDIOS.trampSound=loadAudio('sounds/trampoline.mp3');
    AUDIOS.springSound=loadAudio('sounds/spring_sound.wav');
    AUDIOS.fakePlatform=loadAudio('sounds/lomise.mp3');
    AUDIOS.obstacleCrash=loadAudio('sounds/obstacleCrash.mp3');
    AUDIOS.jetPack=loadAudio('sounds/jetpack.mp3');


  //Sprite loading.
  SPRITES.background=loadSprite('images/bck.png');
  SPRITES.potHole=loadSprite('images/hole.png');
  SPRITES.player=loadSprite('images/blue-lik-right.png');
  SPRITES.playerLeft=loadSprite('images/blue-lik-left.png');
  SPRITES.playerUp=loadSprite('images/blue-lik-up.png');
  SPRITES.uglyEnemy=loadSprite('images/blue_monster.png');
  SPRITES.flyingEnemy=loadSprite('images/blue_flying_monster_1.png');
  SPRITES.purpleEnemy=loadSprite('images/purple_monster.png');
  SPRITES.booster1=loadSprite('images/trampoline_platform.png');
  SPRITES.booster2=loadSprite('images/spring_platform.png');
  SPRITES.booster3=loadSprite('images/jetpack.png');
  SPRITES.boosterJetpack=loadSprite('images/doodle_jetpack.png');
  SPRITES.drinkingGlass=loadSprite('images/potion_grey.png');
  SPRITES.healthReinstate=loadSprite('images/potion_green_notap.png');
  SPRITES.greenPlatform=loadSprite('images/green_platform.png');
  SPRITES.movingPlatform=loadSprite('images/moving_platform.png');
  SPRITES.breakingPlatform=loadSprite('images/breakanimate.png');
  SPRITES.yellowPlatform=loadSprite('images/yellow_platform.png');
  numAssets = assetsStillLoading;
  //console.log(numAssets);
  //console.log(assetsStillLoading);
    assetsLoadingLoop(callback); 
}  

loadAssets(() => {

    new GAME(element);

});

