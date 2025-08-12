import { type EffectReactive } from "./effect";
import { type RefImp } from "./ref";
export interface Link {
  subs: EffectReactive;
  prevSub: Link | undefined;
  nextSub: Link | undefined;
}

export function link(dep: RefImp, subs: EffectReactive) {
  // console.log(1111);
  const newLink: Link = {
    subs,
    prevSub: undefined,
    nextSub: undefined,
  };
  // 判断链表是否有数据
  if (dep.subsTail) {
    dep.subsTail.nextSub = newLink;
    newLink.prevSub = dep.subsTail;
    dep.subsTail = newLink;
  } else {
    dep.subs = newLink;
    dep.subsTail = newLink;
  }
}

export function propagate(subs: Link) {
  let link: Link | undefined = subs;
  let queuedEffect = [];
  while (link) {
    queuedEffect.push(link.subs);
    link = link.nextSub;
  }
  queuedEffect.forEach((subs) => {
    subs.notify();
  });
}
