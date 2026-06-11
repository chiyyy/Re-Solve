import { Button } from "./ui/Button";

interface DeleteConfirmModalProps {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ title, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-gray-900 mb-2 text-lg font-bold">문제 삭제</h3>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
          "{title}"을(를) 삭제하시겠습니까?<br/>이 작업은 되돌릴 수 없습니다.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>취소</Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>삭제</Button>
        </div>
      </div>
    </div>
  );
}
