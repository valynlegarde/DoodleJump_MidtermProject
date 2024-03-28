class Booster{
    constructor(booster,x,y,context,type){
        this.x=x;
        this.y=y;
        this.booster=booster;
        if(type==1 || type==2){
        this.height=25;
        this.width=50;
        }
        else if(type==4)
        {
            this.width=40;
            this.height=27;
        }
        else{
            this.height=30;
            this.width=30;
        }

        
        this.type=type;
        this.context=context;
        
        
    }

    drawBooster()
    {
        this.context.drawImage(this.booster,this.x,this.y,this.width,this.height);
    }

    moveDownBooster(value){
        this.y+=-value;
    }
}