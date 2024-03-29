
const PLATFORM_WIDTH=50;
const PLATFORM_HEIGHT=15;

class Platform{
    constructor(x,y,cxt,type){
        this.context=cxt;
        this.xPosition=x;
        this.jumpCount=0;
        this.platformWidth=PLATFORM_WIDTH;
        this.platformHeight=PLATFORM_HEIGHT;
        this.yPosition=y;
        this.xSpeed=2;
        this.platformType=type;
        this.array=[];
        this.fakePlatDetect=0;
        this.goingTowards='right';
        this.greenPlatform=SPRITES.greenPlatform;
        this.movingPlatform=SPRITES.movingPlatform;
        this.breakingPlatform=SPRITES.breakingPlatform;
        this.yellowPlatform=SPRITES.yellowPlatform;

        this.index = 0;
    }

    
    
    
    drawPlatform(){
        if(this.platformType==1)
        {
        //this.context.fillStyle='green';
        this.context.drawImage(this.greenPlatform,this.xPosition,this.yPosition,this.platformWidth,this.platformHeight);
        }
        if(this.platformType==2)
        {
        //this.context.fillStyle='pink';
        this.context.drawImage(this.movingPlatform,this.xPosition,this.yPosition,this.platformWidth,this.platformHeight);
        }
        if(this.platformType==3)
        {
        //this.context.fillStyle='red';
        this.context.drawImage(this.breakingPlatform,this.index*50,0,50,28,this.xPosition,this.yPosition,this.platformWidth,28);

        }
        if(this.platformType==4)
        {
        //this.context.fillStyle='brown';
        this.context.drawImage(this.yellowPlatform,this.xPosition,this.yPosition,this.platformWidth,this.platformHeight);
        }
          
        //this.context.fillRect(this.xPosition,this.yPosition,this.platformWidth,this.platformHeight);
    }


    movePlatform(score){
        
        if(this.platformType==2){
            
            
            if(this.xPosition>=CANVAS_WIDTH-this.platformWidth){
                this.xSpeed=this.xSpeed*-1;
                this.goingTowards='left';
            }
            if(this.xPosition<=0)
            {
                this.xSpeed=this.xSpeed*-1;
                this.goingTowards='right';
            }
            this.xPosition+=this.xSpeed;
            
            
        }
    }

    platformSpeed(score)
        {   
        
        if(this.platformType==2)
        {    
            if(this.goingTowards=='right')
            {
                if(score<100)
                {
                    this.xSpeed=2;
                }
                if(score>=100 && score<250)
                {
                    this.xSpeed=4;
                }
                if(score>=250 && score<400)
                {
                    this.xSpeed=5;
                }
                if(score>=400 )
                {
                    this.xSpeed=6;
                }
            }
        
            if(this.goingTowards=='left')
            {
                if(score<100)
                {
                    this.xSpeed=-2;
                }
                if(score>=100 && score<250)
                {
                    this.xSpeed=-4;
                }
                if(score>=250 && score<400)
                {
                    this.xSpeed=-5;
                }
                if(score>=400 )
                {
                    this.xSpeed=-6;
                }
            }
        }
    }
    removeOverlap(platformArray){
        this.array=platformArray;
        if (this.array.length==0){
            return true;
        }
        
        else if (this.array.length!=0)
        {
        
            for(let j=0;j<this.array.length;j++)
            {
                var ypos=this.array[j].yPosition;
            {
                if((this.yPosition>=ypos && this.yPosition<=(ypos+this.platformHeight)) || ((this.yPosition+this.platformHeight)>=ypos && (this.yPosition+this.platformHeight)<=(ypos+this.platformHeight)))
                {   
                    
                    return false;
                    
                }
            
            }

        }
        return true;
    }
   
    }
}
