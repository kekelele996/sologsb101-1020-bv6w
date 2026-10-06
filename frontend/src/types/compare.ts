/**
 * 版本比对（Compare）数据模型
 * 同一碑刻下两份拓本的损泐差异清单与断代结论。
 */

/** 断代结论：早本 / 晚本 / 同版 / 待考 */
export type CompareConclusion = 'early' | 'late' | 'same' | 'pending';

/**
 * 人工复核：比对记录落库后可补记一次。
 * 补记后比对台、碑刻台账卡片与导出编目卡的结论均以复核结论为准。
 */
export interface CompareReview {
  /** 复核人 */
  reviewer: string;
  /** 复核断代结论 */
  conclusion: CompareConclusion;
  /** 复核日期 yyyy-MM-dd */
  date: string;
}

export interface Compare {
  id: string;
  /** 所属碑刻 id */
  steleId: string;
  /** 拓本 A id */
  rubbingIdA: string;
  /** 拓本 B id */
  rubbingIdB: string;
  /** 差异字数（保存比对记录时落库的快照值） */
  diffCount: number;
  /** 断代结论（系统推断值；补记复核后以 review.conclusion 为准） */
  conclusion: CompareConclusion;
  /** 操作人 */
  operator: string;
  /** 比对日期 yyyy-MM-dd */
  date: string;
  /** 人工复核（每条记录至多一次；未复核为 undefined，照旧使用系统推断值） */
  review?: CompareReview;
  createdAt: number;
  updatedAt: number;
}

export type CompareDraft = Omit<Compare, 'id' | 'createdAt' | 'updatedAt' | 'review'>;
export type CompareReviewDraft = CompareReview;

export const COMPARE_CONCLUSION_LABEL: Record<CompareConclusion, string> = {
  early: '早本',
  late: '晚本',
  same: '同版',
  pending: '待考',
};

export const COMPARE_CONCLUSION_COLOR: Record<CompareConclusion, string> = {
  early: '#2f6f4f',
  late: '#a8623a',
  same: '#3f5d6b',
  pending: '#8c8c8c',
};

export const COMPARE_CONCLUSION_OPTIONS: ReadonlyArray<{ value: CompareConclusion; label: string }> = [
  { value: 'early', label: '早本' },
  { value: 'late', label: '晚本' },
  { value: 'same', label: '同版' },
  { value: 'pending', label: '待考' },
];

export function createEmptyCompareDraft(steleId: string): CompareDraft {
  return {
    steleId,
    rubbingIdA: '',
    rubbingIdB: '',
    diffCount: 0,
    conclusion: 'pending',
    operator: '',
    date: new Date().toISOString().slice(0, 10),
  };
}

/** 空复核草稿（默认沿用当前结论、复核日期取今天） */
export function createEmptyReviewDraft(conclusion: CompareConclusion = 'pending'): CompareReviewDraft {
  return {
    reviewer: '',
    conclusion,
    date: new Date().toISOString().slice(0, 10),
  };
}

/** 是否补记过复核 */
export function hasReview(compare: Compare): boolean {
  return typeof compare.review === 'object' && compare.review !== null;
}

/** 生效断代结论：补记复核后以复核结论为准，未复核照旧使用系统推断值 */
export function effectiveConclusion(compare: Compare): CompareConclusion {
  return compare.review ? compare.review.conclusion : compare.conclusion;
}

/** 生效日期：复核记录用复核日期，未复核用比对日期 */
export function effectiveDate(compare: Compare): string {
  return compare.review ? compare.review.date : compare.date;
}
