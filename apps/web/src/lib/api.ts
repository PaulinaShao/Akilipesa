import { call } from './firebase';

// AI jobs
export async function startJob(type: string, inputs: any) {
  const res = await call<{type:string,inputs:any},{jobId:string}>('createJob')({ type, inputs });
  return res.data.jobId;
}

// Agora tokens
export async function getRtc() {
  const res = await call<{}, {channel:string, uid:number, token:string, appId:string}>('getRtcToken')({});
  return res.data;
}

export async function endCall(payload: {channel:string, minutes:number, msisdn?:string, tier?:'free'|'premium'}) {
  await call<typeof payload, {ok:true}>('endCall')(payload);
}

// Payments
export async function createOrder(payload: any) {
  const res = await call<any, {paymentLink:string}>('payments-createOrder')(payload);
  return res.data.paymentLink;
}
