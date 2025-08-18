import { type EffectReactive } from "./effect";
import { type RefImp } from "./ref";
import { Link } from "./system";

/**
 * 订阅者
 */
export interface Sub {
  deps: Link | undefined;
  depsTail: Link | undefined;
}

export interface Link {
  sub: EffectReactive | undefined;
  prevSub: Link | undefined;
  nextSub: Link | undefined;
  dep: RefImp | undefined;
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
    nextDep: nexDep,
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
}

export function propagate(subs: Link) {
  let link: Link | undefined = subs;
  let queuedEffect = [];
  while (link) {
    queuedEffect.push(link.sub);
    link = link.nextSub;
  }
  queuedEffect.forEach((subs) => {
    subs?.notify();
  });
}
export function clearTracking(link: Link | undefined) {
  while (link) {
    const { dep, nextDep, prevSub, sub, nextSub } = link;
    /**
     * 如果 prevSub 存在，说明是链表的中间节点
     * 如果不存在，说明是链表的头节点
     */
    if (prevSub) {
      prevSub.nextSub = nextSub;
      link.nextSub = undefined;
    } else {
      dep && (dep.subs = nextSub as Link);
    }

    /**
     * 如果 nextSub 存在，说明是链表的中间节点
     * 如果不存在，说明是链表的尾节点
     */
    if (nextSub) {
      nextSub.prevSub = prevSub;
      link.prevSub = undefined;
    } else {
      dep && (dep.subsTail = prevSub as Link);
    }

    link.dep = link.sub = undefined;
    link.nextDep = undefined;
    link = nextDep;
  }
}
export function endTracking(sub: EffectReactive) {
  const depsTail = sub.depsTail;
  if (depsTail) {
    if (depsTail.nextDep) {
      // 需要清理依赖
      clearTracking(depsTail.nextDep);
      depsTail.nextDep = undefined;
    }
  } else if (sub.deps) {
    // 清理依赖
    clearTracking(sub.deps);
    sub.deps = undefined;
  }
}
/**
 * 开始收集依赖
 */
export function startTracking(dep: EffectReactive) {
  // 将 depsTail 重置为 undefined
  dep.depsTail = undefined;
}
