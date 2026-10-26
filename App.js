import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StatusBar,
  Alert, KeyboardAvoidingView, Platform
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOLD = "#E7B94F", BG = "#0B0D10", PANEL = "#15191F", MUTED = "#9AA4B2", WHITE = "#F5F7FA", LINE = "#2A3039";
const STORE = "gym_pt_pro_offline_v1";
const muscleGroups = ["Ngực", "Lưng", "Vai", "Tay trước", "Tay sau", "Chân", "Mông/đùi sau", "Bắp chân", "Bụng/core", "Cardio"];
const exercises = [
 {id:"ch1",name:"Đẩy ngực đòn ngang",en:"Barbell bench press",group:"Ngực",level:"Trung cấp",equipment:"Tạ đòn + ghế",sets:"3–4",reps:"6–10",rest:"120 giây",steps:"Giữ bả vai ổn định; hạ thanh có kiểm soát về giữa ngực; đẩy lên không bật nảy.",mistakes:"Nảy thanh khỏi ngực, cổ tay gập quá mức, nhấc mông khỏi ghế."},
 {id:"ch2",name:"Chống đẩy",en:"Push-up",group:"Ngực",level:"Cơ bản",equipment:"Trọng lượng cơ thể",sets:"3",reps:"8–15",rest:"60–90 giây",steps:"Giữ thân người thành đường thẳng; hạ ngực gần sàn; đẩy sàn ra xa.",mistakes:"Võng lưng, khuỷu xòe quá rộng."},
 {id:"ch3",name:"Đẩy ngực dốc lên tạ đơn",en:"Incline dumbbell press",group:"Ngực",level:"Trung cấp",equipment:"Tạ đơn + ghế dốc",sets:"3",reps:"8–12",rest:"90–120 giây",steps:"Chỉnh ghế dốc vừa phải; hạ tạ cạnh ngực trên; đẩy lên có kiểm soát.",mistakes:"Dốc ghế quá cao, va tạ mạnh ở đỉnh."},
 {id:"ba1",name:"Kéo xô trước ngực",en:"Lat pulldown",group:"Lưng",level:"Cơ bản",equipment:"Máy kéo xô",sets:"3",reps:"8–12",rest:"90 giây",steps:"Kéo bả vai xuống trước; kéo tay cầm về vùng ngực trên; trở về từ từ.",mistakes:"Ngả người quá sâu, giật bằng đà."},
 {id:"ba2",name:"Kéo tạ đơn một tay",en:"One-arm dumbbell row",group:"Lưng",level:"Cơ bản",equipment:"Tạ đơn + ghế",sets:"3",reps:"8–12 mỗi bên",rest:"60–90 giây",steps:"Giữ lưng trung lập; kéo khuỷu về phía hông; hạ tạ chậm.",mistakes:"Xoay thân quá nhiều, giật tạ."},
 {id:"ba3",name:"Hít xà",en:"Pull-up",group:"Lưng",level:"Nâng cao",equipment:"Xà đơn",sets:"3",reps:"4–10",rest:"120 giây",steps:"Bắt đầu bằng kiểm soát bả vai; kéo người lên; hạ xuống có kiểm soát.",mistakes:"Đung đưa quá mạnh, cố quá biên độ vai."},
 {id:"va1",name:"Đẩy vai tạ đơn",en:"Dumbbell shoulder press",group:"Vai",level:"Trung cấp",equipment:"Tạ đơn + ghế",sets:"3",reps:"8–12",rest:"90 giây",steps:"Siết bụng; đẩy tạ lên theo đường tự nhiên; không ưỡn lưng quá mức.",mistakes:"Ưỡn lưng, hạ tạ quá sâu gây khó chịu."},
 {id:"va2",name:"Dang tạ ngang",en:"Lateral raise",group:"Vai",level:"Cơ bản",equipment:"Tạ đơn",sets:"3",reps:"12–20",rest:"60 giây",steps:"Khuỷu hơi cong; nâng tạ đến khoảng ngang vai; hạ chậm.",mistakes:"Đung đưa thân, nhún vai quá mức."},
 {id:"ta1",name:"Cuốn tay trước tạ đơn",en:"Dumbbell curl",group:"Tay trước",level:"Cơ bản",equipment:"Tạ đơn",sets:"3",reps:"10–15",rest:"60 giây",steps:"Giữ khuỷu gần thân; cuốn tạ lên; hạ xuống chậm.",mistakes:"Đung đưa lưng, đưa khuỷu ra trước quá nhiều."},
 {id:"ta2",name:"Cuốn búa",en:"Hammer curl",group:"Tay trước",level:"Cơ bản",equipment:"Tạ đơn",sets:"3",reps:"10–15",rest:"60 giây",steps:"Lòng bàn tay hướng vào nhau; cuốn tạ không xoay cổ tay.",mistakes:"Dùng đà, nhún vai."},
 {id:"ts1",name:"Duỗi tay sau với dây cáp",en:"Cable triceps pushdown",group:"Tay sau",level:"Cơ bản",equipment:"Máy cáp",sets:"3",reps:"10–15",rest:"60 giây",steps:"Giữ khuỷu sát thân; duỗi khuỷu xuống; trở về có kiểm soát.",mistakes:"Đung đưa vai, khuỷu di chuyển quá nhiều."},
 {id:"ts2",name:"Duỗi tay sau qua đầu",en:"Overhead triceps extension",group:"Tay sau",level:"Trung cấp",equipment:"Tạ đơn hoặc cáp",sets:"3",reps:"10–15",rest:"60–90 giây",steps:"Giữ bắp tay ổn định; gập khuỷu có kiểm soát; duỗi lên.",mistakes:"Ưỡn lưng, đau khuỷu nhưng vẫn cố tập."},
 {id:"chana1",name:"Squat goblet",en:"Goblet squat",group:"Chân",level:"Cơ bản",equipment:"Tạ đơn/kettlebell",sets:"3",reps:"8–12",rest:"90 giây",steps:"Giữ tạ trước ngực; gối đi cùng hướng mũi chân; xuống sâu trong biên độ thoải mái.",mistakes:"Gót nhấc, gối sụp vào trong, mất thăng bằng."},
 {id:"chana2",name:"Squat đòn",en:"Barbell squat",group:"Chân",level:"Nâng cao",equipment:"Giá squat + tạ đòn",sets:"3–5",reps:"4–8",rest:"150–180 giây",steps:"Thiết lập giá an toàn; siết thân; hạ và đứng lên có kiểm soát trong biên độ phù hợp.",mistakes:"Mất trung lập cột sống, chọn tải quá sức, không có chốt an toàn."},
 {id:"chana3",name:"Đạp chân máy",en:"Leg press",group:"Chân",level:"Cơ bản",equipment:"Máy leg press",sets:"3",reps:"10–15",rest:"90 giây",steps:"Đặt chân vững; hạ bệ đến biên độ hông cho phép; không khóa gối mạnh.",mistakes:"Hạ quá sâu làm lưng cuộn, khóa gối đột ngột."},
 {id:"mong1",name:"Hip thrust",en:"Barbell hip thrust",group:"Mông/đùi sau",level:"Trung cấp",equipment:"Ghế + tạ",sets:"3–4",reps:"8–12",rest:"90 giây",steps:"Tựa lưng trên ghế; đẩy hông lên; giữ xương sườn hạ và siết mông ở đỉnh.",mistakes:"Ưỡn lưng quá mức, đặt ghế không chắc."},
 {id:"mong2",name:"Romanian deadlift",en:"Romanian deadlift",group:"Mông/đùi sau",level:"Trung cấp",equipment:"Tạ đòn hoặc tạ đơn",sets:"3",reps:"8–12",rest:"120 giây",steps:"Gối hơi chùng; đẩy hông ra sau; giữ tạ sát chân và lưng trung lập.",mistakes:"Biến thành squat, tạ rời xa chân, cố xuống quá sâu."},
 {id:"mong3",name:"Cuốn đùi sau máy",en:"Seated leg curl",group:"Mông/đùi sau",level:"Cơ bản",equipment:"Máy leg curl",sets:"3",reps:"10–15",rest:"60–90 giây",steps:"Chỉnh đệm đúng vị trí; cuốn gót về sau; trở lại chậm.",mistakes:"Giật tạ, chỉnh máy sai."},
 {id:"bc1",name:"Nhón bắp chân đứng",en:"Standing calf raise",group:"Bắp chân",level:"Cơ bản",equipment:"Máy hoặc bậc chắc chắn",sets:"3",reps:"12–20",rest:"60 giây",steps:"Hạ gót có kiểm soát; nhón lên cao; tránh nảy.",mistakes:"Nhún nảy, biên độ quá ngắn."},
 {id:"bu1",name:"Plank",en:"Plank",group:"Bụng/core",level:"Cơ bản",equipment:"Thảm",sets:"3",reps:"20–45 giây",rest:"45–60 giây",steps:"Siết bụng và mông; giữ đầu, lưng, hông thẳng; thở đều.",mistakes:"Võng lưng, nín thở."},
 {id:"bu2",name:"Dead bug",en:"Dead bug",group:"Bụng/core",level:"Cơ bản",equipment:"Thảm",sets:"3",reps:"8–12 mỗi bên",rest:"45–60 giây",steps:"Giữ lưng dưới ổn định; duỗi tay và chân đối bên chậm; trở về.",mistakes:"Lưng dưới nhấc khỏi sàn, làm quá nhanh."},
 {id:"car1",name:"Đi bộ dốc",en:"Incline treadmill walk",group:"Cardio",level:"Cơ bản",equipment:"Máy chạy bộ",sets:"1",reps:"15–30 phút",rest:"Theo nhu cầu",steps:"Chọn tốc độ và độ dốc vẫn nói chuyện được; tăng dần theo thể lực.",mistakes:"Bám tay vịn để treo người, tăng cường độ quá nhanh."}
];
const mealTemplates = {
 muscle: [
  ["Sáng","Yến mạch + sữa/sữa đậu nành + chuối + trứng"],
  ["Trưa","Cơm + ức gà/cá/đậu phụ + rau"],
  ["Bữa phụ","Sữa chua hoặc sữa + trái cây + một phần hạt"],
  ["Tối","Cơm/khoai + thịt nạc/cá/đậu + rau"]
 ],
 fat: [
  ["Sáng","Trứng hoặc sữa chua giàu đạm + yến mạch + trái cây"],
  ["Trưa","Cơm khẩu phần phù hợp + cá/gà/đậu phụ + nhiều rau"],
  ["Bữa phụ","Trái cây nguyên quả hoặc sữa chua không đường"],
  ["Tối","Đạm nạc + rau + cơm/khoai theo nhu cầu năng lượng"]
 ],
 general: [
  ["Sáng","Trứng/đậu phụ + bánh mì nguyên cám hoặc yến mạch + trái cây"],
  ["Trưa","Cơm + cá/gà/đậu phụ + rau đa dạng"],
  ["Bữa phụ","Sữa chua/sữa hoặc trái cây"],
  ["Tối","Nguồn đạm + tinh bột phù hợp + rau"]
 ]
};
const goals = {muscle:"Tăng cơ",fat:"Giảm mỡ",gain:"Tăng cân",strength:"Tăng sức mạnh",fitness:"Sức khỏe/thể lực"};
const levels = {beginner:"Người mới",intermediate:"Trung cấp",advanced:"Nâng cao",pro:"Chuyên nghiệp"};

function Card({children, style={}}){return <View style={[{backgroundColor:PANEL,borderColor:LINE,borderWidth:1,borderRadius:16,padding:14,marginBottom:10},style]}>{children}</View>}
function Txt({children,size=14,color=WHITE,bold=false,style={}}){return <Text style={[{fontSize:size,color,fontWeight:bold?"700":"400",lineHeight:size*1.45},style]}>{children}</Text>}
function Btn({title,onPress,secondary=false,style={}}){return <Pressable onPress={onPress} style={[{backgroundColor:secondary?PANEL:GOLD,paddingVertical:11,paddingHorizontal:14,borderRadius:12,alignItems:"center",borderWidth:secondary?1:0,borderColor:LINE},style]}><Text style={{color:secondary?WHITE:"#141414",fontWeight:"700"}}>{title}</Text></Pressable>}
function Field({label,value,onChange,placeholder,keyboardType}){return <View style={{marginBottom:10}}><Txt color={MUTED} size={12}>{label}</Txt><TextInput value={value} onChangeText={onChange} placeholder={placeholder||""} placeholderTextColor="#667080" keyboardType={keyboardType||"default"} style={{color:WHITE,backgroundColor:"#0D1015",borderWidth:1,borderColor:LINE,borderRadius:10,padding:11,marginTop:5}} /></View>}
function Chip({label,active,onPress}){return <Pressable onPress={onPress} style={{paddingVertical:8,paddingHorizontal:11,borderRadius:20,backgroundColor:active?GOLD:"#20252D",marginRight:7,marginBottom:7}}><Text style={{fontSize:12,fontWeight:"600",color:active?"#151515":WHITE}}>{label}</Text></Pressable>}

export default function App(){
 const [tab,setTab]=useState("home");
 const [data,setData]=useState({clients:[],plans:[],payments:[],notes:[]});
 const [loaded,setLoaded]=useState(false);
 const [query,setQuery]=useState("");
 const [group,setGroup]=useState("Tất cả");
 const [selectedExercise,setSelectedExercise]=useState(null);
 const [showClientForm,setShowClientForm]=useState(false);
 const [clientForm,setClientForm]=useState({name:"",age:"25",height:"170",weight:"65",goal:"muscle",level:"beginner",days:"4",equipment:"gym",notes:""});
 const [planClient,setPlanClient]=useState(null);
 const [planGoal,setPlanGoal]=useState("muscle");
 const [planLevel,setPlanLevel]=useState("beginner");
 const [planDays,setPlanDays]=useState("4");
 const [planEquipment,setPlanEquipment]=useState("gym");
 const [nutritionClient,setNutritionClient]=useState(null);
 const [nutritionGoal,setNutritionGoal]=useState("muscle");
 const [nutritionWeight,setNutritionWeight]=useState("65");
 const [nutritionHeight,setNutritionHeight]=useState("170");
 const [nutritionAge,setNutritionAge]=useState("25");
 const [nutritionSex,setNutritionSex]=useState("male");
 const [activity,setActivity]=useState("1.45");
 const [calorieAdjust,setCalorieAdjust]=useState("250");
 const [newPayment,setNewPayment]=useState({client:"",amount:"",note:""});
 const [showPaymentForm,setShowPaymentForm]=useState(false);

 useEffect(()=>{(async()=>{try{const raw=await AsyncStorage.getItem(STORE);if(raw)setData(JSON.parse(raw));}catch(e){}setLoaded(true)})()},[]);
 useEffect(()=>{if(loaded)AsyncStorage.setItem(STORE,JSON.stringify(data)).catch(()=>{})},[data,loaded]);

 const filteredExercises=useMemo(()=>exercises.filter(e=>(group==="Tất cả"||e.group===group)&&(`${e.name} ${e.en} ${e.group} ${e.equipment}`).toLowerCase().includes(query.toLowerCase())),[group,query]);
 const money=n=>Number(n||0).toLocaleString("vi-VN")+" đ";
 const updateClientField=(key,value)=>setClientForm(p=>({...p,[key]:value}));
 const addClient=()=>{
  if(!clientForm.name.trim()){Alert.alert("Thiếu thông tin","Vui lòng nhập tên học viên.");return;}
  const client={...clientForm,id:Date.now().toString(),createdAt:new Date().toISOString()};
  setData(p=>({...p,clients:[client,...p.clients]}));setShowClientForm(false);
  setClientForm({name:"",age:"25",height:"170",weight:"65",goal:"muscle",level:"beginner",days:"4",equipment:"gym",notes:""});
 };
 const generatePlan=(client)=>{
  const goal=client?.goal||planGoal, level=client?.level||planLevel, days=Number(client?.days||planDays), equipment=client?.equipment||planEquipment;
  const pool=exercises.filter(e=>{
   if(equipment==="home"&&!/Trọng lượng cơ thể|Thảm|Tạ đơn|bậc chắc chắn/i.test(e.equipment))return false;
   if(equipment==="dumbbell"&&!/Tạ đơn|Thảm|Trọng lượng cơ thể/i.test(e.equipment))return false;
   if(level==="beginner"&&e.level==="Nâng cao")return false;
   return true;
  });
  const split=days<=3?[["Ngực","Vai","Tay sau","Bụng/core"],["Lưng","Tay trước","Cardio"],["Chân","Mông/đùi sau","Bắp chân","Bụng/core"]]:
   days===4?[["Ngực","Vai","Tay sau"],["Lưng","Tay trước"],["Chân","Mông/đùi sau","Bắp chân"],["Ngực","Lưng","Bụng/core"]]:
   days===5?[["Ngực","Tay sau"],["Lưng","Tay trước"],["Chân","Bụng/core"],["Vai","Cardio"],["Mông/đùi sau","Chân","Bắp chân"]]:
   [["Ngực","Tay sau"],["Lưng","Tay trước"],["Chân","Bụng/core"],["Vai","Cardio"],["Ngực","Lưng"],["Mông/đùi sau","Chân","Bắp chân"]];
  const weeks=[];
  for(let d=1;d<=30;d++){
   const dayOfWeek=(d-1)%7, trainDay=dayOfWeek<days;
   if(dayOfWeek===6){weeks.push({day:d,rest:true,title:"Phục hồi",exercises:[]});continue;}
   if(!trainDay){weeks.push({day:d,rest:true,title:"Nghỉ / đi bộ nhẹ",exercises:[]});continue;}
   const splitIndex=dayOfWeek%split.length;
   const wanted=split[splitIndex];
   const picks=[];
   wanted.forEach(g=>{const found=pool.filter(e=>e.group===g);if(found.length)picks.push(found[(Math.floor((d-1)/7)+d+g.length)%found.length]);});
   if(picks.length<3){pool.filter(e=>!picks.some(p=>p.id===e.id)).slice(0,3-picks.length).forEach(e=>picks.push(e));}
   weeks.push({day:d,rest:false,title:wanted.join(" • "),exercises:picks.slice(0,5).map(e=>({id:e.id,name:e.name,sets:e.sets,reps:e.reps,rest:e.rest}))});
  }
  const plan={id:Date.now().toString(),clientId:client?.id||null,clientName:client?.name||"Kế hoạch mẫu",goal,level,days,equipment,createdAt:new Date().toISOString(),schedule:weeks};
  setData(p=>({...p,plans:[plan,...p.plans]}));setPlanClient(plan.clientId);Alert.alert("Đã tạo kế hoạch","Đã lưu khung lịch 30 ngày trên thiết bị. PT cần rà soát và điều chỉnh trước khi áp dụng.");
  setTab("plans");
 };
 const savePayment=()=>{
  if(!newPayment.amount||Number(newPayment.amount)<=0){Alert.alert("Thiếu số tiền","Nhập số tiền hợp lệ.");return;}
  const item={...newPayment,id:Date.now().toString(),paid:false,createdAt:new Date().toISOString()};
  setData(p=>({...p,payments:[item,...p.payments]}));setNewPayment({client:"",amount:"",note:""});setShowPaymentForm(false);
 };
 const totalPaid=data.payments.filter(p=>p.paid).reduce((s,p)=>s+Number(p.amount||0),0);
 const totalPending=data.payments.filter(p=>!p.paid).reduce((s,p)=>s+Number(p.amount||0),0);
 const weightNum=Number(nutritionWeight), heightNum=Number(nutritionHeight), ageNum=Number(nutritionAge);
 const bmr=nutritionSex==="male"?10*weightNum+6.25*heightNum-5*ageNum+5:10*weightNum+6.25*heightNum-5*ageNum-161;
 const maintenance=Math.round(bmr*Number(activity||1.45));
 const calTarget=Math.round(maintenance+(nutritionGoal==="muscle"||nutritionGoal==="gain"?Math.abs(Number(calorieAdjust)||250):nutritionGoal==="fat"?-Math.abs(Number(calorieAdjust)||250):0));
 const protein=Math.round(weightNum*(nutritionGoal==="fat"?1.6:1.6));
 const fat=Math.round((calTarget*0.27)/9), carbs=Math.max(0,Math.round((calTarget-protein*4-fat*9)/4));
 const selectedMeal=mealTemplates[nutritionGoal==="fat"?"fat":nutritionGoal==="muscle"||nutritionGoal==="gain"?"muscle":"general"];

 const renderHome=()=> <ScrollView contentContainerStyle={{padding:16,paddingBottom:110}}>
  <View style={{marginBottom:18}}><Txt color={GOLD} size={12} bold>GYM PT PRO</Txt><Txt size={27} bold>Trung tâm điều khiển</Txt><Txt color={MUTED}>Bản offline • dữ liệu lưu trên iPhone</Txt></View>
  <Card><Txt color={MUTED}>HỌC VIÊN</Txt><Txt size={30} bold>{data.clients.length}</Txt><Txt color={MUTED} size={12}>Hồ sơ đang lưu trên thiết bị</Txt></Card>
  <View style={{flexDirection:"row",gap:8}}><Card style={{flex:1}}><Txt color={MUTED} size={12}>ĐÃ THU</Txt><Txt size={18} bold>{money(totalPaid)}</Txt></Card><Card style={{flex:1}}><Txt color={MUTED} size={12}>CHƯA THU</Txt><Txt size={18} bold>{money(totalPending)}</Txt></Card></View>
  <Card><Txt size={17} bold>Truy cập nhanh</Txt><View style={{gap:8,marginTop:12}}><Btn title="+ Thêm học viên" onPress={()=>{setTab("clients");setShowClientForm(true)}}/><Btn title="Tạo giáo án 30 ngày" onPress={()=>setTab("plans")} secondary/><Btn title="Tra cứu kho bài tập" onPress={()=>setTab("exercises")} secondary/><Btn title="Tính dinh dưỡng" onPress={()=>setTab("nutrition")} secondary/></View></Card>
  <Card><Txt size={16} bold>Đã lưu gần đây</Txt>{data.plans.slice(0,3).map(p=><View key={p.id} style={{paddingVertical:10,borderBottomWidth:1,borderBottomColor:LINE}}><Txt bold>{p.clientName}</Txt><Txt color={MUTED} size={12}>{goals[p.goal]} • {levels[p.level]} • 30 ngày</Txt></View>)}{!data.plans.length&&<Txt color={MUTED}>Chưa có giáo án. Tạo giáo án đầu tiên trong mục Giáo án.</Txt>}</Card>
  <Txt color={MUTED} size={11}>Lưu ý: dữ liệu không tự đồng bộ sang thiết bị khác. Hãy sao lưu định kỳ và không xóa ứng dụng khi chưa sao lưu.</Txt>
 </ScrollView>;

 const renderClients=()=> <ScrollView contentContainerStyle={{padding:16,paddingBottom:110}}>
  <Txt size={25} bold>Học viên</Txt><Txt color={MUTED} style={{marginBottom:14}}>Hồ sơ cá nhân lưu offline</Txt>
  <Btn title={showClientForm?"Đóng biểu mẫu":"+ Thêm học viên"} onPress={()=>setShowClientForm(!showClientForm)} style={{marginBottom:12}}/>
  {showClientForm&&<Card>
   <Field label="Tên học viên *" value={clientForm.name} onChange={v=>updateClientField("name",v)} placeholder="Nhập tên"/>
   <View style={{flexDirection:"row",gap:8}}><View style={{flex:1}}><Field label="Tuổi" value={clientForm.age} onChange={v=>updateClientField("age",v)} keyboardType="numeric"/></View><View style={{flex:1}}><Field label="Chiều cao (cm)" value={clientForm.height} onChange={v=>updateClientField("height",v)} keyboardType="numeric"/></View><View style={{flex:1}}><Field label="Cân nặng (kg)" value={clientForm.weight} onChange={v=>updateClientField("weight",v)} keyboardType="numeric"/></View></View>
   <Txt color={MUTED} size={12}>Mục tiêu</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{Object.entries(goals).map(([k,v])=><Chip key={k} label={v} active={clientForm.goal===k} onPress={()=>updateClientField("goal",k)}/>)}</View>
   <Txt color={MUTED} size={12}>Trình độ</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{Object.entries(levels).map(([k,v])=><Chip key={k} label={v} active={clientForm.level===k} onPress={()=>updateClientField("level",k)}/>)}</View>
   <Txt color={MUTED} size={12}>Thiết bị</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{[["gym","Phòng gym"],["home","Tại nhà"],["dumbbell","Tạ đơn"]].map(([k,v])=><Chip key={k} label={v} active={clientForm.equipment===k} onPress={()=>updateClientField("equipment",k)}/>)}</View>
   <Txt color={MUTED} size={12}>Buổi tập/tuần</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{["3","4","5","6"].map(v=><Chip key={v} label={v+" buổi"} active={clientForm.days===v} onPress={()=>updateClientField("days",v)}/>)}</View>
   <Field label="Ghi chú / hạn chế / yêu cầu" value={clientForm.notes} onChange={v=>updateClientField("notes",v)} placeholder="Dị ứng, chấn thương, lịch tập..."/>
   <Btn title="Lưu hồ sơ học viên" onPress={addClient}/>
  </Card>}
  {data.clients.map(c=><Card key={c.id}><Txt size={17} bold>{c.name}</Txt><Txt color={MUTED}>{c.age} tuổi • {c.height} cm • {c.weight} kg</Txt><Txt>{goals[c.goal]} • {levels[c.level]} • {c.days} buổi/tuần</Txt>{c.notes?<Txt color={MUTED} size={12}>{c.notes}</Txt>:null}<View style={{flexDirection:"row",gap:8,marginTop:12}}><View style={{flex:1}}><Btn title="Tạo giáo án" onPress={()=>generatePlan(c)}/></View><View style={{flex:1}}><Btn title="Xóa hồ sơ" secondary onPress={()=>Alert.alert("Xóa học viên?",`Xóa hồ sơ ${c.name}? Giáo án đã tạo không tự xóa.`,[{text:"Hủy",style:"cancel"},{text:"Xóa",style:"destructive",onPress:()=>setData(p=>({...p,clients:p.clients.filter(x=>x.id!==c.id)}))}])}/></View></View></Card>)}
  {!data.clients.length&&!showClientForm&&<Card><Txt color={MUTED}>Chưa có học viên. Nhấn “Thêm học viên” để bắt đầu.</Txt></Card>}
 </ScrollView>;

 const renderExercises=()=> <ScrollView contentContainerStyle={{padding:16,paddingBottom:110}}>
  <Txt size={25} bold>Kho bài tập</Txt><Txt color={MUTED} style={{marginBottom:12}}>Bộ bài tập mẫu offline • có hướng dẫn và lưu ý kỹ thuật</Txt>
  <TextInput value={query} onChangeText={setQuery} placeholder="Tìm tên bài, nhóm cơ, thiết bị..." placeholderTextColor="#667080" style={{backgroundColor:PANEL,color:WHITE,borderWidth:1,borderColor:LINE,borderRadius:12,padding:12,marginBottom:12}}/>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:8}}>{["Tất cả",...muscleGroups].map(g=><Chip key={g} label={g} active={group===g} onPress={()=>setGroup(g)}/>)}</ScrollView>
  <Txt color={MUTED} size={12}>{filteredExercises.length} bài phù hợp</Txt>
  {filteredExercises.map(e=><Pressable key={e.id} onPress={()=>setSelectedExercise(selectedExercise===e.id?null:e.id)}><Card><View style={{flexDirection:"row",justifyContent:"space-between",gap:8}}><View style={{flex:1}}><Txt size={16} bold>{e.name}</Txt><Txt color={MUTED} size={12}>{e.en} • {e.group}</Txt></View><Txt color={GOLD} size={12} bold>{e.level}</Txt></View><Txt color={MUTED} size={12} style={{marginTop:6}}>{e.equipment} • {e.sets} hiệp × {e.reps}</Txt>{selectedExercise===e.id&&<View style={{marginTop:12,borderTopWidth:1,borderTopColor:LINE,paddingTop:12}}><Txt bold>Cách thực hiện</Txt><Txt>{e.steps}</Txt><Txt bold style={{marginTop:8}}>Lỗi thường gặp</Txt><Txt color={MUTED}>{e.mistakes}</Txt><Txt color={MUTED} size={12} style={{marginTop:8}}>Nghỉ: {e.rest}. Dừng nếu đau bất thường; chọn tải phù hợp kỹ thuật.</Txt></View>}</Card></Pressable>)}
 </ScrollView>;

 const renderPlans=()=> <ScrollView contentContainerStyle={{padding:16,paddingBottom:110}}>
  <Txt size={25} bold>Giáo án 30 ngày</Txt><Txt color={MUTED} style={{marginBottom:12}}>Tạo kế hoạch mẫu offline, sau đó PT rà soát và chỉnh sửa.</Txt>
  <Card><Txt size={17} bold>Tạo giáo án nhanh</Txt>
   <Txt color={MUTED} size={12} style={{marginTop:10}}>Học viên (không bắt buộc)</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}><Chip label="Kế hoạch mẫu" active={!planClient} onPress={()=>setPlanClient(null)}/>{data.clients.map(c=><Chip key={c.id} label={c.name} active={planClient===c.id} onPress={()=>{setPlanClient(c.id);setPlanGoal(c.goal);setPlanLevel(c.level);setPlanDays(c.days);setPlanEquipment(c.equipment)}}/>)}</View>
   <Txt color={MUTED} size={12}>Mục tiêu</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{Object.entries(goals).map(([k,v])=><Chip key={k} label={v} active={planGoal===k} onPress={()=>setPlanGoal(k)}/>)}</View>
   <Txt color={MUTED} size={12}>Trình độ</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{Object.entries(levels).map(([k,v])=><Chip key={k} label={v} active={planLevel===k} onPress={()=>setPlanLevel(k)}/>)}</View>
   <Txt color={MUTED} size={12}>Buổi tập mỗi tuần</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{["3","4","5","6"].map(v=><Chip key={v} label={v+" buổi"} active={planDays===v} onPress={()=>setPlanDays(v)}/>)}</View>
   <Txt color={MUTED} size={12}>Thiết bị</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{[["gym","Phòng gym"],["home","Tại nhà"],["dumbbell","Tạ đơn"]].map(([k,v])=><Chip key={k} label={v} active={planEquipment===k} onPress={()=>setPlanEquipment(k)}/>)}</View>
   <Btn title="Tạo và lưu lịch 30 ngày" onPress={()=>generatePlan(data.clients.find(c=>c.id===planClient)||null)} style={{marginTop:8}}/>
  </Card>
  {data.plans.map(p=><Card key={p.id}><Txt size={17} bold>{p.clientName}</Txt><Txt color={MUTED}>{goals[p.goal]} • {levels[p.level]} • {p.days} buổi/tuần</Txt><Txt color={MUTED} size={12}>Tạo lúc {new Date(p.createdAt).toLocaleDateString("vi-VN")}</Txt>{p.schedule.map(d=><View key={d.day} style={{paddingVertical:9,borderTopWidth:1,borderTopColor:LINE,marginTop:8}}><Txt bold>Ngày {d.day}: {d.title}</Txt>{d.rest?<Txt color={MUTED} size={12}>Phục hồi / nghỉ</Txt>:d.exercises.map((e,i)=><Txt key={e.id+i} size={12}>• {e.name} — {e.sets} hiệp × {e.reps}</Txt>)}</View>)}</Card>)}
  {!data.plans.length&&<Card><Txt color={MUTED}>Chưa có kế hoạch nào được lưu.</Txt></Card>}
 </ScrollView>;

 const renderNutrition=()=> <ScrollView contentContainerStyle={{padding:16,paddingBottom:110}}>
  <Txt size={25} bold>Dinh dưỡng</Txt><Txt color={MUTED} style={{marginBottom:12}}>Ước tính ban đầu và gợi ý thực đơn. Không thay thế đánh giá chuyên môn.</Txt>
  <Card><Txt size={17} bold>Máy tính năng lượng</Txt>
   <View style={{flexDirection:"row",gap:8}}><View style={{flex:1}}><Field label="Cân nặng (kg)" value={nutritionWeight} onChange={setNutritionWeight} keyboardType="numeric"/></View><View style={{flex:1}}><Field label="Chiều cao (cm)" value={nutritionHeight} onChange={setNutritionHeight} keyboardType="numeric"/></View></View>
   <Field label="Tuổi" value={nutritionAge} onChange={setNutritionAge} keyboardType="numeric"/>
   <Txt color={MUTED} size={12}>Công thức BMR dùng ước tính theo giới tính sinh học</Txt><View style={{flexDirection:"row",marginTop:6}}><Chip label="Nam" active={nutritionSex==="male"} onPress={()=>setNutritionSex("male")}/><Chip label="Nữ" active={nutritionSex==="female"} onPress={()=>setNutritionSex("female")}/></View>
   <Txt color={MUTED} size={12}>Mức vận động</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{[["1.2","Ít vận động"],["1.375","Nhẹ"],["1.55","Vừa"],["1.725","Cao"]].map(([k,v])=><Chip key={k} label={v} active={activity===k} onPress={()=>setActivity(k)}/>)}</View>
   <Txt color={MUTED} size={12}>Mục tiêu</Txt><View style={{flexDirection:"row",flexWrap:"wrap",marginTop:6}}>{Object.entries(goals).map(([k,v])=><Chip key={k} label={v} active={nutritionGoal===k} onPress={()=>setNutritionGoal(k)}/>)}</View>
   <Field label="Điều chỉnh năng lượng (kcal/ngày)" value={calorieAdjust} onChange={setCalorieAdjust} keyboardType="numeric"/>
   <View style={{backgroundColor:"#0D1015",padding:12,borderRadius:12,marginTop:4}}><Txt color={MUTED} size={12}>Năng lượng duy trì ước tính</Txt><Txt size={23} bold>{Math.max(0,maintenance).toLocaleString("vi-VN")} kcal/ngày</Txt><Txt color={MUTED} size={12}>Mục tiêu tham khảo</Txt><Txt size={23} bold color={GOLD}>{Math.max(0,calTarget).toLocaleString("vi-VN")} kcal/ngày</Txt><Txt color={MUTED} size={12}>Protein {protein} g • Carb {carbs} g • Chất béo {fat} g</Txt></View>
   <Txt color={MUTED} size={11} style={{marginTop:10}}>Công thức chỉ là ước tính, có sai số cá nhân. Không dùng mục tiêu này cho trẻ vị thành niên, người mang thai/cho con bú hoặc người có bệnh lý cần chế độ chuyên biệt nếu chưa được chuyên gia đánh giá.</Txt>
  </Card>
  <Card><Txt size={17} bold>Thực đơn khung một ngày</Txt><Txt color={MUTED} size={12}>Có thể lặp và thay đổi món trong tháng; khẩu phần cần được tính lại theo mục tiêu và thói quen thực tế.</Txt>{selectedMeal.map(([time,meal])=><View key={time} style={{paddingVertical:10,borderTopWidth:1,borderTopColor:LINE,marginTop:8}}><Txt color={GOLD} bold>{time}</Txt><Txt>{meal}</Txt></View>)}<Txt color={MUTED} size={12} style={{marginTop:8}}>Hỏi học viên về dị ứng, bệnh lý, thực phẩm kiêng, ngân sách và món ưa thích trước khi chốt thực đơn.</Txt></Card>
 </ScrollView>;

 const renderRevenue=()=> <ScrollView contentContainerStyle={{padding:16,paddingBottom:110}}>
  <Txt size={25} bold>Doanh thu PT</Txt><Txt color={MUTED} style={{marginBottom:12}}>Theo dõi khoản thu thủ công, dữ liệu lưu offline.</Txt>
  <View style={{flexDirection:"row",gap:8}}><Card style={{flex:1}}><Txt color={MUTED} size={12}>ĐÃ THU</Txt><Txt size={18} bold>{money(totalPaid)}</Txt></Card><Card style={{flex:1}}><Txt color={MUTED} size={12}>CHƯA THU</Txt><Txt size={18} bold>{money(totalPending)}</Txt></Card></View>
  <Btn title={showPaymentForm?"Đóng biểu mẫu":"+ Thêm khoản thu"} onPress={()=>setShowPaymentForm(!showPaymentForm)} style={{marginBottom:12}}/>
  {showPaymentForm&&<Card><Field label="Tên học viên" value={newPayment.client} onChange={v=>setNewPayment(p=>({...p,client:v}))} placeholder="Tên học viên"/><Field label="Số tiền (VND)" value={newPayment.amount} onChange={v=>setNewPayment(p=>({...p,amount:v}))} keyboardType="numeric" placeholder="Ví dụ 3000000"/><Field label="Ghi chú" value={newPayment.note} onChange={v=>setNewPayment(p=>({...p,note:v}))} placeholder="Gói PT/tháng..."/><Btn title="Lưu khoản thu" onPress={savePayment}/></Card>}
  {data.payments.map(p=><Card key={p.id}><View style={{flexDirection:"row",justifyContent:"space-between",gap:8}}><View style={{flex:1}}><Txt bold>{p.client||"Chưa ghi tên"}</Txt><Txt color={MUTED} size={12}>{p.note||"Khoản PT"} • {new Date(p.createdAt).toLocaleDateString("vi-VN")}</Txt></View><Txt bold color={p.paid?GOLD:"#FFB86B"}>{money(p.amount)}</Txt></View><View style={{flexDirection:"row",gap:8,marginTop:10}}><View style={{flex:1}}><Btn title={p.paid?"Đã thu":"Đánh dấu đã thu"} secondary={!p.paid} onPress={()=>setData(d=>({...d,payments:d.payments.map(x=>x.id===p.id?{...x,paid:!x.paid}:x)}))}/></View><View><Btn title="Xóa" secondary onPress={()=>Alert.alert("Xóa khoản thu?","",[{text:"Hủy",style:"cancel"},{text:"Xóa",style:"destructive",onPress:()=>setData(d=>({...d,payments:d.payments.filter(x=>x.id!==p.id)}))}])}/></View></View></Card>)}
  {!data.payments.length&&<Card><Txt color={MUTED}>Chưa có khoản thu nào.</Txt></Card>}
  <Card><Txt bold>Sao lưu dữ liệu</Txt><Txt color={MUTED} size={12}>Bản hiện tại lưu dữ liệu trên iPhone. Chức năng xuất/nhập bản sao lưu sẽ cần được bổ sung trước khi dùng cho dữ liệu khách hàng quan trọng.</Txt><Btn title="Xóa toàn bộ dữ liệu" secondary onPress={()=>Alert.alert("Cảnh báo","Thao tác này xóa toàn bộ hồ sơ, giáo án và khoản thu trên thiết bị.",[{text:"Hủy",style:"cancel"},{text:"Xóa hết",style:"destructive",onPress:()=>setData({clients:[],plans:[],payments:[],notes:[]})}])} style={{marginTop:10}}/></Card>
 </ScrollView>;

 const tabs=[["home","Tổng quan","⌂"],["clients","Học viên","♙"],["exercises","Bài tập","✦"],["plans","Giáo án","▦"],["nutrition","Ăn uống","◉"],["revenue","Doanh thu","₫"]];
 return <SafeAreaView style={{flex:1,backgroundColor:BG}}><StatusBar barStyle="light-content" backgroundColor={BG}/>{!loaded?<View style={{flex:1,justifyContent:"center",alignItems:"center"}}><Txt>Đang tải dữ liệu...</Txt></View>:<><View style={{flex:1}}>{tab==="home"?renderHome():tab==="clients"?renderClients():tab==="exercises"?renderExercises():tab==="plans"?renderPlans():tab==="nutrition"?renderNutrition():renderRevenue()}</View><View style={{flexDirection:"row",backgroundColor:"#11151A",borderTopWidth:1,borderTopColor:LINE,paddingTop:7,paddingBottom:Platform.OS==="ios"?8:6}}>{tabs.map(([id,label,icon])=><Pressable key={id} onPress={()=>setTab(id)} style={{flex:1,alignItems:"center",paddingVertical:5}}><Text style={{fontSize:19,color:tab===id?GOLD:MUTED}}>{icon}</Text><Text style={{fontSize:9,color:tab===id?GOLD:MUTED,fontWeight:tab===id?"700":"400",marginTop:2}}>{label}</Text></Pressable>)}</View></>}</SafeAreaView>;
}
