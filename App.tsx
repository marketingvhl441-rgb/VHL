import React, { useState } from 'react';
import { 
  User, 
  Users, 
  GraduationCap, 
  Heart, 
  Brain, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Baby,
  Activity,
  LayoutDashboard,
  PlusCircle,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

import { QUESTIONS } from './constants';
import { PersonalDetails, ChildDetails, SurveyResponse, Step, AssessmentResult } from './types';
import { Button } from './components/Button';

const App: React.FC = () => {
  // --- State ---
  const [step, setStep] = useState<Step>(Step.WELCOME);
  
  // Store all completed assessments
  const [allResults, setAllResults] = useState<AssessmentResult[]>([]);

  const [personalInfo, setPersonalInfo] = useState<PersonalDetails>({
    name: '',
    age: '',
    phone: ''
  });

  const [childInfo, setChildInfo] = useState<ChildDetails>({
    count: 1,
    child1Age: '',
    child2Age: '',
    schoolPerformance: 5
  });

  const [surveyAnswers, setSurveyAnswers] = useState<SurveyResponse>({});

  // --- Handlers ---

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChildInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnswer = (questionId: number, value: number) => {
    setSurveyAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateScore = () => {
    let warmthScore = 0;
    let controlScore = 0;
    let supportScore = 0;
    let maxWarmth = 0;
    let maxControl = 0;
    let maxSupport = 0;

    QUESTIONS.forEach(q => {
      const val = surveyAnswers[q.id] || 0;
      if (q.category === 'warmth') {
        warmthScore += val;
        maxWarmth += 2;
      } else if (q.category === 'control') {
        controlScore += val;
        maxControl += 2;
      } else if (q.category === 'support') {
        supportScore += val;
        maxSupport += 2;
      }
    });

    return { 
      warmthScore, 
      controlScore, 
      supportScore,
      maxWarmth: maxWarmth || 1, 
      maxControl: maxControl || 1, 
      maxSupport: maxSupport || 1
    };
  };

  const getParentingStyle = (warmth: number, control: number, maxW: number, maxC: number) => {
    const wPercent = warmth / maxW;
    const cPercent = control / maxC;

    if (wPercent > 0.6 && cPercent > 0.6) return { title: "संतुलित (Authoritative)", desc: "आप स्नेह और अनुशासन का सही संतुलन बनाए रखते हैं। यह बच्चों के विकास के लिए सबसे उत्तम माना जाता है।" };
    if (wPercent > 0.6 && cPercent <= 0.6) return { title: "उदार (Permissive)", desc: "आप बहुत स्नेही हैं लेकिन अनुशासन में थोड़ी ढील देते हैं। कभी-कभी सीमाएं तय करना जरूरी होता है।" };
    if (wPercent <= 0.6 && cPercent > 0.6) return { title: "सख्त (Authoritarian)", desc: "आप अनुशासन पर बहुत जोर देते हैं। बच्चों को थोड़ा और स्नेह और आजादी देने से रिश्ता बेहतर होगा।" };
    return { title: "अलिप्त (Uninvolved)", desc: "आपको बच्चे के जीवन में और अधिक शामिल होने की आवश्यकता हो सकती है। बातचीत और समय बढ़ाएं।" };
  };

  const handleFinishSurvey = () => {
    const scores = calculateScore();
    const style = getParentingStyle(scores.warmthScore, scores.controlScore, scores.maxWarmth, scores.maxControl);
    
    const newResult: AssessmentResult = {
      id: Date.now().toString(),
      timestamp: new Date(),
      personalInfo: { ...personalInfo },
      childInfo: { ...childInfo },
      scores: scores,
      styleTitle: style.title
    };

    setAllResults(prev => [newResult, ...prev]);
    setStep(Step.RESULTS);
  };

  const handleRestart = () => {
    setPersonalInfo({ name: '', age: '', phone: '' });
    setChildInfo({ count: 1, child1Age: '', child2Age: '', schoolPerformance: 5 });
    setSurveyAnswers({});
    setStep(Step.WELCOME);
  };

  // --- Render Steps ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner">
        <Heart className="w-12 h-12 text-indigo-600" />
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">परवरिश शैली मूल्यांकन</h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
          हर माता-पिता की अपनी अलग स्टाइल होती है। आइए जानें आपकी परवरिश शैली आपके बच्चे के विकास में कैसे मदद कर रही है।
        </p>
      </div>
      <Button onClick={() => setStep(Step.PERSONAL_INFO)} className="w-56 text-lg shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transform transition-all">
        शुरू करें <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <User className="w-6 h-6 text-indigo-600" />
        </div>
        आपकी जानकारी
      </h2>
      <div className="space-y-5 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">आपका नाम</label>
          <input 
            type="text" 
            name="name"
            value={personalInfo.name}
            onChange={handlePersonalChange}
            placeholder="जैसे: अजय"
            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">उम्र</label>
            <input 
              type="number" 
              name="age"
              value={personalInfo.age}
              onChange={handlePersonalChange}
              placeholder="28"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">मोबाइल नंबर</label>
            <input 
              type="tel" 
              name="phone"
              value={personalInfo.phone}
              onChange={handlePersonalChange}
              placeholder="98XXXXXXXX"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
        </div>
        <div className="pt-4">
          <Button 
            fullWidth 
            disabled={!personalInfo.name || !personalInfo.age}
            onClick={() => setStep(Step.CHILD_INFO)}
          >
            अगला <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderChildInfo = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <div className="p-2 bg-rose-100 rounded-lg">
          <Baby className="w-6 h-6 text-rose-500" />
        </div>
        बच्चों का विवरण
      </h2>
      <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">कितने बच्चे हैं? *</label>
          <div className="flex gap-4">
            {[1, 2, 3].map(num => (
              <button
                key={num}
                onClick={() => setChildInfo(prev => ({ ...prev, count: num }))}
                className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                  childInfo.count === num 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md' 
                    : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                {num} {num > 1 ? 'बच्चे' : 'बच्चा'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">पहले बच्चे की उम्र *</label>
            <input 
              type="number" 
              name="child1Age"
              value={childInfo.child1Age}
              onChange={handleChildChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
          </div>
          {childInfo.count > 1 && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">दूसरे बच्चे की उम्र</label>
              <input 
                type="number" 
                name="child2Age"
                value={childInfo.child2Age}
                onChange={handleChildChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            पढ़ाई में बच्चे का प्रदर्शन (1-10) *
            <span className="block text-xs text-slate-500 font-normal mt-1">(1 = बहुत कमजोर, 10 = बहुत अच्छा)</span>
          </label>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-2xl font-bold text-indigo-600 w-10 text-center">{childInfo.schoolPerformance}</span>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={childInfo.schoolPerformance}
              onChange={(e) => setChildInfo(prev => ({...prev, schoolPerformance: parseInt(e.target.value)}))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={() => setStep(Step.PERSONAL_INFO)}>
            <ChevronLeft className="w-4 h-4" /> पीछे
          </Button>
          <Button 
            className="flex-1" 
            disabled={!childInfo.child1Age}
            onClick={() => setStep(Step.SURVEY)}
          >
            प्रश्नावली शुरू करें <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSurvey = () => {
    const answeredCount = Object.keys(surveyAnswers).length;
    const progress = (answeredCount / QUESTIONS.length) * 100;
    const allAnswered = answeredCount === QUESTIONS.length;

    return (
      <div className="max-w-3xl mx-auto pb-24">
        <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-4 mb-6 border-b border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-slate-800">व्यवहार प्रश्नावली</h2>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              {answeredCount} / {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-6">
          {QUESTIONS.map((q, index) => {
            const currentAnswer = surveyAnswers[q.id];
            const isAnswered = currentAnswer !== undefined;
            
            return (
              <div 
                key={q.id} 
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  isAnswered 
                    ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                    : 'bg-white border-slate-100 shadow-sm hover:border-indigo-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    isAnswered ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-lg font-medium text-slate-800 mb-1">{q.text}</p>
                    {q.subText && <p className="text-sm text-slate-500 italic mb-5">{q.subText}</p>}
                    
                    <div className="flex flex-wrap gap-3 mt-2">
                      {[
                        { val: 0, label: 'ना', color: 'text-red-600 border-red-200 hover:bg-red-50' },
                        { val: 1, label: 'कभी-कभी', color: 'text-yellow-600 border-yellow-200 hover:bg-yellow-50' },
                        { val: 2, label: 'हाँ', color: 'text-green-600 border-green-200 hover:bg-green-50' }
                      ].map((option) => {
                         const isSelected = currentAnswer === option.val;
                         return (
                          <button
                            key={option.val}
                            onClick={() => handleAnswer(q.id, option.val)}
                            className={`px-6 py-2 rounded-full border-2 font-medium transition-all duration-200 flex-1 sm:flex-none ${
                              isSelected
                                ? 'bg-slate-800 text-white border-slate-800 shadow-lg scale-105 ring-2 ring-slate-200 ring-offset-2'
                                : `bg-white ${option.color} hover:border-current`
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 flex justify-center z-20">
          <div className="w-full max-w-3xl flex gap-4">
             <Button variant="outline" onClick={() => setStep(Step.CHILD_INFO)}>
               <ChevronLeft className="w-4 h-4" /> पीछे
            </Button>
            <Button 
              fullWidth 
              disabled={!allAnswered}
              onClick={handleFinishSurvey}
              className={`${!allAnswered ? 'opacity-50 cursor-not-allowed' : 'shadow-lg shadow-indigo-200'}`}
            >
              परिणाम देखें (See Result)
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const scores = calculateScore();
    const style = getParentingStyle(scores.warmthScore, scores.controlScore, scores.maxWarmth, scores.maxControl);
    
    const barData = [
      { name: 'स्नेह (Warmth)', score: scores.warmthScore, full: scores.maxWarmth, fill: '#4f46e5' },
      { name: 'नियंत्रण (Control)', score: scores.controlScore, full: scores.maxControl, fill: '#e11d48' },
    ];

    const radarData = [
      { subject: 'स्नेह\n(Warmth)', A: Math.round((scores.warmthScore / scores.maxWarmth) * 100), fullMark: 100 },
      { subject: 'नियंत्रण\n(Control)', A: Math.round((scores.controlScore / scores.maxControl) * 100), fullMark: 100 },
      { subject: 'सहयोग\n(Support)', A: Math.round((scores.supportScore / scores.maxSupport) * 100), fullMark: 100 },
    ];

    return (
      <div className="max-w-5xl mx-auto pb-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">मूल्यांकन परिणाम</h2>
          <p className="text-slate-500">श्री/श्रीमती {personalInfo.name} ({personalInfo.age} वर्ष), यह रहा आपका विश्लेषण</p>
        </div>

        {/* Result Summary Card - Full Width */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-8 flex flex-col md:flex-row gap-8 items-stretch">
           <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-600" /> 
                आपकी मुख्य परवरिश शैली
              </h3>
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 h-full flex flex-col justify-center">
                <h4 className="text-3xl font-bold text-indigo-700 mb-3">{style.title}</h4>
                <p className="text-slate-700 text-lg leading-relaxed">{style.desc}</p>
              </div>
           </div>
           <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex-1 flex flex-col justify-center">
                 <div className="text-sm font-medium text-slate-500 mb-1">बच्चों की संख्या</div>
                 <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                   <Users className="w-5 h-5 text-indigo-500" />
                   {childInfo.count}
                 </div>
              </div>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex-1 flex flex-col justify-center">
                 <div className="text-sm font-medium text-slate-500 mb-1">स्कूल प्रदर्शन</div>
                 <div className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                   <GraduationCap className="w-5 h-5 text-green-500" />
                   {childInfo.schoolPerformance}/10
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 min-h-[400px] flex flex-col">
             <h3 className="text-xl font-bold text-slate-700 mb-4">स्कोर तुलना (Absolute Score)</h3>
             <div className="flex-1 w-full min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 'dataMax']} hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: '#f8fafc'}}
                    />
                    <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={40}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 text-center text-sm text-slate-400 bg-slate-50 py-2 rounded-lg">
               यह ग्राफ आपके द्वारा प्राप्त कुल अंकों को दर्शाता है।
             </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 min-h-[400px] flex flex-col">
             <h3 className="text-xl font-bold text-slate-700 mb-4">परवरिश संतुलन (Balance Profile)</h3>
             <div className="flex-1 w-full min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                   <PolarGrid stroke="#e2e8f0" gridType="polygon" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                   <Radar
                     name="Percentage"
                     dataKey="A"
                     stroke="#8b5cf6"
                     strokeWidth={3}
                     fill="#8b5cf6"
                     fillOpacity={0.4}
                   />
                   <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 text-center text-sm text-slate-400 bg-slate-50 py-2 rounded-lg">
               यह चार्ट तीनों क्षेत्रों में आपके संतुलन को प्रतिशत (%) में दिखाता है।
             </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Brain className="w-7 h-7" />
              विशेष सुझाव (Recommendations)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-4 text-indigo-50">
                  <li className="flex items-start gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm transition-colors hover:bg-white/20">
                    <CheckCircle2 className="w-6 h-6 mt-0.5 text-green-300 flex-shrink-0" />
                    <span><strong>प्रशंसा की शक्ति:</strong> बच्चे की छोटी उपलब्धियों पर उसकी प्रशंसा करें, इससे 'स्नेह' का स्कोर बढ़ता है।</span>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm transition-colors hover:bg-white/20">
                    <CheckCircle2 className="w-6 h-6 mt-0.5 text-green-300 flex-shrink-0" />
                    <span><strong>सकारात्मक अनुशासन:</strong> गलती होने पर मारने की जगह बात करके समझाएं, इससे 'नियंत्रण' सकारात्मक रहता है।</span>
                  </li>
                </ul>
                <ul className="space-y-4 text-indigo-50">
                  <li className="flex items-start gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm transition-colors hover:bg-white/20">
                    <CheckCircle2 className="w-6 h-6 mt-0.5 text-green-300 flex-shrink-0" />
                    <span><strong>समय दें:</strong> दिन में कम से कम 15 मिनट बच्चे के साथ बिना फोन के समय बिताएं।</span>
                  </li>
                   <li className="flex items-start gap-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm transition-colors hover:bg-white/20">
                    <CheckCircle2 className="w-6 h-6 mt-0.5 text-green-300 flex-shrink-0" />
                    <span><strong>भावनात्मक सहयोग:</strong> जब बच्चा दुखी हो, तो तुरंत सलाह देने के बजाय पहले उसकी बात सुनें (सहयोग)।</span>
                  </li>
                </ul>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        <div className="mt-12 text-center">
          <Button variant="secondary" onClick={handleRestart} className="px-8 text-lg">
            दोबारा शुरू करें (Restart)
          </Button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="max-w-6xl mx-auto pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-indigo-600" />
              एडमिन डैशबोर्ड (Admin Dashboard)
            </h2>
            <p className="text-slate-500 mt-1">कुल मूल्यांकन: {allResults.length}</p>
          </div>
          <div className="flex gap-3">
             <div className="relative">
               <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by name..." 
                 className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-full md:w-64"
               />
             </div>
             <Button variant="primary" onClick={handleRestart}>
                <PlusCircle className="w-5 h-5" /> New Assessment
             </Button>
          </div>
        </div>

        {allResults.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-1">कोई डेटा नहीं मिला</h3>
            <p className="text-slate-500">अभी तक कोई मूल्यांकन पूरा नहीं किया गया है।</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="p-5 font-semibold">नाम / उम्र</th>
                    <th className="p-5 font-semibold">बच्चे</th>
                    <th className="p-5 font-semibold">परवरिश शैली</th>
                    <th className="p-5 font-semibold text-center">स्कोर (W / C / S)</th>
                    <th className="p-5 font-semibold">तारीख</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allResults.map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="p-5">
                        <div className="font-bold text-slate-800 text-lg">{result.personalInfo.name}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                           <User className="w-3 h-3" /> {result.personalInfo.age} वर्ष | {result.personalInfo.phone}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                            {result.childInfo.count}
                          </span>
                          <span className="text-sm text-slate-500">
                            Performance: <span className="font-semibold text-slate-700">{result.childInfo.schoolPerformance}/10</span>
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-50 text-violet-700 border border-violet-100">
                           {result.styleTitle.split('(')[0]}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                           <div className="text-center">
                              <div className="text-xs text-slate-400 mb-1">Warmth</div>
                              <div className="font-bold text-indigo-600 bg-indigo-50 rounded px-2 py-1">{result.scores.warmthScore}</div>
                           </div>
                           <div className="text-center">
                              <div className="text-xs text-slate-400 mb-1">Control</div>
                              <div className="font-bold text-rose-600 bg-rose-50 rounded px-2 py-1">{result.scores.controlScore}</div>
                           </div>
                           <div className="text-center">
                              <div className="text-xs text-slate-400 mb-1">Support</div>
                              <div className="font-bold text-emerald-600 bg-emerald-50 rounded px-2 py-1">{result.scores.supportScore}</div>
                           </div>
                        </div>
                      </td>
                      <td className="p-5 text-slate-500 text-sm">
                        {result.timestamp.toLocaleDateString('en-IN')}
                        <div className="text-xs text-slate-400">{result.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-8">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 h-16 flex items-center justify-center md:justify-between shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(Step.WELCOME)}>
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">P</div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            ParentingPulse
          </span>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setStep(Step.DASHBOARD)}
             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
               step === Step.DASHBOARD 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
             }`}
           >
             <LayoutDashboard className="w-4 h-4" />
             Dashboard
           </button>
           <div className="hidden md:block text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            v1.2
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div key={step} className="animate-fade-in w-full">
          {step === Step.WELCOME && renderWelcome()}
          {step === Step.PERSONAL_INFO && renderPersonalInfo()}
          {step === Step.CHILD_INFO && renderChildInfo()}
          {step === Step.SURVEY && renderSurvey()}
          {step === Step.RESULTS && renderResults()}
          {step === Step.DASHBOARD && renderDashboard()}
        </div>
      </main>
    </div>
  );
};

export default App;