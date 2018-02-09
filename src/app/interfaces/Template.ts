export interface Template {
    id:number,
    serial_number:string,//序列号
    batch:string,//批次
    model:string,//型号
    production_date:Date,//生产日期
    deliver_date:Date,//发货日期
    relevancy_party:string,//关联厂家
    batch_comment:string,//备注
}
