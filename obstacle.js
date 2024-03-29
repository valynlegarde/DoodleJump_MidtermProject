class Obstacle{
    constructor(obstacle,x,y,context,type){
        this.x=x;
        this.y=y;
        this.obstacle=obstacle;
        this.height=50;
        this.width=50;
        this.type=type;
        this.xSpeed=2.5;
        this.ySpeed=-1;
        this.context=context;
        
        
    }

    drawObstacle()
    {
        this.context.drawImage(this.obstacle,this.x,this.y,this.width,this.height);
        
    
    }

    moveDownObstacle(value){
        this.y+=-value;
    }

    individualMotion()
    {   
        if(this.type==2)
        {
            this.x+=this.xSpeed;

            if(this.x>=CANVAS_WIDTH-this.width){
                this.xSpeed=this.xSpeed*-1;
            }
            if(this.x<=0){
                this.xSpeed=this.xSpeed* -1;
            }
        }

        if(this.type==3)

        {
            this.x+=this.xSpeed;
            this.y+=getRandom(-1,3);
            if(this.x>=CANVAS_WIDTH-this.width){
                this.xSpeed=this.xSpeed*-1;
            }
            if(this.x<=0){
                this.xSpeed=this.xSpeed* -1;
            }
        }

        if(this.type==4)
            {
            
            this.x+=this.xSpeed;
            this.y+=this.ySpeed;
            if(this.x>=CANVAS_WIDTH-this.width)
            {
                
                this.xSpeed=this.xSpeed*-1;
                this.ySpeed=1;
                this.y+=this.ySpeed;
                //counter=counter+1;
            }
            if(this.x<=0){
                this.ySpeed=-1;
                this.xSpeed=this.xSpeed* -1;
                this.y+=this.ySpeed;
            }
        }
        
    }
    
}
