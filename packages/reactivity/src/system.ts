import { type EffectReactive } from "./effect";
import { type RefImp } from "./ref";

/**
 * 订阅者
 */
export interface Sub {
  deps: Link | undefined;
  depsTail: Link | undefined;
}

export interface Link {
  sub: EffectReactive;
  prevSub: Link | undefined;
  nextSub: Link | undefined;
  dep: RefImp;
  nextDep: Link | undefined;
}

export function link(dep: RefImp, sub: EffectReactive) {
  // 判断是否已经收集了依赖
  const currentDep = sub.depsTail;

  const nexDep = currentDep === undefined ? sub.deps : currentDep.nextDep;
  if (nexDep && nexDep.dep === dep) {
    // 将 sub 指针移动
    sub.depsTail = nexDep;
    return;
  }

  const newLink: Link = {
    sub,
    dep,
    nextDep: undefined,
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

  // 添加deps
  if (sub.depsTail) {
    sub.depsTail.nextDep = newLink;
    sub.depsTail = newLink;
  } else {
    sub.deps = newLink;
    sub.depsTail = newLink;
  }

  console.log(dep);
}

export function propagate(subs: Link) {
  let link: Link | undefined = subs;
  let queuedEffect = [];
  while (link) {
    queuedEffect.push(link.sub);
    link = link.nextSub;
  }
  queuedEffect.forEach((subs) => {
    subs.notify();
  });
}
